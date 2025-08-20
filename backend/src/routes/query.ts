import { Router, Request, Response } from 'express';
import { ragPipeline, QueryRequest } from '../services/ragPipeline';
import { logger } from '../utils/logger';

const router = Router();

/**
 * POST /api/query
 * Process a repair question through the RAG pipeline
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { question, brand, component, manualType }: QueryRequest = req.body;

    // Validate request
    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Question is required and must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (question.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Question cannot be empty',
        timestamp: new Date().toISOString(),
      });
    }

    if (question.length > 1000) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Question is too long (maximum 1000 characters)',
        timestamp: new Date().toISOString(),
      });
    }

    // Validate optional parameters
    if (brand && typeof brand !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Brand must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (component && typeof component !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Component must be a string',
        timestamp: new Date().toISOString(),
      });
    }

    if (manualType && !['service', 'owner', 'parts', 'wiring'].includes(manualType)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Manual type must be one of: service, owner, parts, wiring',
        timestamp: new Date().toISOString(),
      });
    }

    logger.info(`Processing query request: "${question}"`, {
      brand,
      component,
      manualType,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
    });

    // Process the query through the RAG pipeline
    const response = await ragPipeline.processQuery({
      question: question.trim(),
      brand,
      component,
      manualType,
    });

    logger.info(`Query processed successfully`, {
      question: question.trim(),
      searchResults: response.metadata.searchResults,
      processingTime: response.metadata.processingTime,
    });

    // Return the response
    res.status(200).json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Error processing query:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('OPENAI_API_KEY')) {
        return res.status(500).json({
          error: 'Configuration Error',
          message: 'OpenAI API key is not configured',
          timestamp: new Date().toISOString(),
        });
      }
      
      if (error.message.includes('PINECONE')) {
        return res.status(500).json({
          error: 'Configuration Error',
          message: 'Vector database is not configured',
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Generic error response
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to process your question. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/query/stats
 * Get pipeline statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await ragPipeline.getPipelineStats();
    
    res.status(200).json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    logger.error('Error getting pipeline stats:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve pipeline statistics',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/query/health
 * Health check for the query service
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'Query Service',
    timestamp: new Date().toISOString(),
    endpoints: {
      query: 'POST /',
      stats: 'GET /stats',
      health: 'GET /health',
    },
  });
});

export default router;