import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { logger } from '../utils/logger';
import { vectorDB, VectorEntry, VectorMetadata } from '../services/vectorDB';
import { openaiClient } from '../services/openaiClient';
import { parsePDF } from '../utils/pdfParser';
import { chunkText } from '../utils/textChunker';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const router = Router();

/**
 * POST /api/ingest/pdf
 * Ingest a PDF service manual
 */
router.post('/pdf', upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'PDF file is required',
        timestamp: new Date().toISOString(),
      });
    }

    const { brand, component, manualType = 'service' } = req.body;

    // Validate required fields
    if (!brand || typeof brand !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Brand is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!component || typeof component !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Component is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (!['service', 'owner', 'parts', 'wiring'].includes(manualType)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Manual type must be one of: service, owner, parts, wiring',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info(`Processing PDF upload: ${req.file.originalname}`, {
      brand,
      component,
      manualType,
      fileSize: req.file.size,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    // Step 1: Parse PDF and extract text
    const pdfText = await parsePDF(req.file.path);
    logger.debug(`Extracted ${pdfText.length} characters from PDF`);

    // Step 2: Split text into chunks
    const textChunks = chunkText(pdfText);
    logger.debug(`Split text into ${textChunks.length} chunks`);

    // Step 3: Generate embeddings for each chunk
    const vectors: VectorEntry[] = [];
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const embeddings = await openaiClient.generateEmbeddings(chunk);
      
      const metadata: VectorMetadata = {
        brand,
        component,
        manualType: manualType as 'service' | 'owner' | 'parts' | 'wiring',
        source: req.file.originalname,
        chunkIndex: i,
        totalChunks: textChunks.length,
        createdAt: new Date().toISOString(),
        fileSize: req.file.size,
        pageNumber: Math.floor(i / 10) + 1, // Approximate page number
      };

      const vectorId = `${req.file.filename}-chunk-${i}`;
      
      vectors.push({
        id: vectorId,
        values: embeddings,
        metadata,
      });

      // Log progress for large files
      if (textChunks.length > 50 && i % 10 === 0) {
        logger.debug(`Processed ${i + 1}/${textChunks.length} chunks`);
      }
    }

    // Step 4: Store vectors in Pinecone
    await vectorDB.upsertVectors(vectors);
    logger.info(`Successfully stored ${vectors.length} vectors for ${req.file.originalname}`);

    // Step 5: Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'PDF processed and stored successfully',
      data: {
        filename: req.file.originalname,
        brand,
        component,
        manualType,
        chunksProcessed: vectors.length,
        fileSize: req.file.size,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        logger.warn('Failed to cleanup uploaded file:', cleanupError);
      }
    }

    logger.error('Error processing PDF upload:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Only PDF files are allowed')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Only PDF files are allowed',
          timestamp: new Date().toISOString(),
        });
      }
      
      if (error.message.includes('File too large')) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'File size exceeds 50MB limit',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process PDF. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/ingest/status
 * Get ingestion status and statistics
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const stats = await vectorDB.getIndexStats();
    
    res.status(200).json({
      success: true,
      data: {
        indexName: process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals',
        totalVectors: stats.totalVectorCount || 0,
        dimension: stats.dimension || 1536,
        timestamp: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    logger.error('Error getting ingestion status:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve ingestion status',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * DELETE /api/ingest/clear
 * Clear all vectors for a specific brand/component
 */
router.delete('/clear', async (req: Request, res: Response) => {
  try {
    const { brand, component, manualType } = req.body;

    if (!brand && !component && !manualType) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'At least one filter parameter (brand, component, or manualType) is required',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info('Clearing vectors with filter:', { brand, component, manualType });

    await vectorDB.deleteVectors({ brand, component, manualType });

    res.status(200).json({
      success: true,
      message: 'Vectors cleared successfully',
      data: { brand, component, manualType },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Error clearing vectors:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to clear vectors',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/ingest/health
 * Health check for the ingest service
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'Ingest Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      pdf: 'POST /pdf',
      status: 'GET /status',
      clear: 'DELETE /clear',
      health: 'GET /health',
    },
  });
});

export default router;