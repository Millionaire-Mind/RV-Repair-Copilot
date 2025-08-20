#!/usr/bin/env ts-node

/**
 * RV Repair Copilot - Embeddings Builder CLI Tool
 * 
 * This script precomputes embeddings for PDFs and other content to optimize
 * the RAG pipeline performance and reduce API calls during queries.
 * 
 * Usage:
 *   npm run embeddings:build <input-path> [options]
 *   npm run embeddings:update <index-name> [options]
 *   npm run embeddings:optimize [options]
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../backend/src/utils/logger';
import { parsePDF } from '../backend/src/utils/pdfParser';
import { chunkText } from '../backend/src/utils/textChunker';
import { openaiClient } from '../backend/src/services/openaiClient';
import { vectorDB, VectorEntry, VectorMetadata } from '../backend/src/services/vectorDB';

// Load environment variables
dotenv.config();

// Configure logging for CLI
logger.level = 'info';

interface EmbeddingOptions {
  brand?: string;
  component?: string;
  manualType: 'service' | 'owner' | 'parts' | 'wiring';
  chunkSize?: number;
  overlapSize?: number;
  batchSize?: number;
  saveToFile?: boolean;
  outputDir?: string;
  updateExisting?: boolean;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

interface EmbeddingResult {
  filePath: string;
  success: boolean;
  chunksProcessed: number;
  vectorsCreated: number;
  processingTime: number;
  error?: string;
  metadata?: {
    fileSize: number;
    textLength: number;
    chunkCount: number;
    embeddingDimension: number;
  };
}

class EmbeddingsBuilder {
  private options: EmbeddingOptions;
  private totalVectors: number = 0;
  private totalProcessingTime: number = 0;

  constructor(options: EmbeddingOptions) {
    this.options = {
      chunkSize: 1000,
      overlapSize: 100,
      batchSize: 100,
      ...options,
    };
    
    if (options.verbose) {
      logger.level = 'debug';
    }
  }

  /**
   * Build embeddings for a file or directory
   */
  async buildEmbeddings(inputPath: string): Promise<EmbeddingResult[]> {
    try {
      logger.info(`Building embeddings for: ${inputPath}`);

      if (!fs.existsSync(inputPath)) {
        throw new Error(`Input path does not exist: ${inputPath}`);
      }

      const stat = fs.statSync(inputPath);
      let results: EmbeddingResult[] = [];

      if (stat.isDirectory()) {
        results = await this.processDirectory(inputPath);
      } else if (stat.isFile()) {
        const result = await this.processFile(inputPath);
        results = [result];
      } else {
        throw new Error(`Input path is neither a file nor directory: ${inputPath}`);
      }

      // Generate summary
      this.generateSummary(results);
      
      return results;
      
    } catch (error) {
      logger.error(`Failed to build embeddings for ${inputPath}:`, error);
      throw error;
    }
  }

  /**
   * Update existing embeddings in the database
   */
  async updateEmbeddings(indexName?: string): Promise<void> {
    try {
      logger.info('Updating existing embeddings in database');

      // Get current index stats
      const stats = await vectorDB.getIndexStats();
      const currentIndex = indexName || process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals';
      
      if (stats.indexName !== currentIndex) {
        throw new Error(`Index mismatch: expected ${currentIndex}, got ${stats.indexName}`);
      }

      logger.info(`Current index: ${stats.indexName}, vectors: ${stats.totalVectorCount || 0}`);

      // In a real implementation, you would:
      // 1. Scan for updated source files
      // 2. Compare timestamps with existing vectors
      // 3. Rebuild embeddings for changed content
      // 4. Remove obsolete vectors
      
      logger.info('Embeddings update completed (mock implementation)');
      
    } catch (error) {
      logger.error('Failed to update embeddings:', error);
      throw error;
    }
  }

  /**
   * Optimize embeddings for better performance
   */
  async optimizeEmbeddings(): Promise<void> {
    try {
      logger.info('Optimizing embeddings for performance');

      // Get current index stats
      const stats = await vectorDB.getIndexStats();
      
      if (!stats.totalVectorCount || stats.totalVectorCount === 0) {
        logger.warn('No vectors found to optimize');
        return;
      }

      // In a real implementation, you would:
      // 1. Analyze vector distribution and quality
      // 2. Remove low-quality or duplicate vectors
      // 3. Optimize chunk sizes based on query patterns
      // 4. Implement caching strategies
      // 5. Optimize search parameters
      
      logger.info(`Optimization completed for ${stats.totalVectorCount} vectors (mock implementation)`);
      
    } catch (error) {
      logger.error('Failed to optimize embeddings:', error);
      throw error;
    }
  }

  /**
   * Process a single file
   */
  private async processFile(filePath: string): Promise<EmbeddingResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Processing file: ${filePath}`);

      // Validate file type
      if (!this.validateFile(filePath)) {
        return {
          filePath,
          success: false,
          chunksProcessed: 0,
          vectorsCreated: 0,
          processingTime: Date.now() - startTime,
          error: 'Invalid file type',
        };
      }

      // Extract metadata from filename
      const metadata = this.extractMetadataFromFilename(filePath);
      
      // Parse file content
      const content = await this.extractContent(filePath);
      if (!content || content.trim().length === 0) {
        return {
          filePath,
          success: false,
          chunksProcessed: 0,
          vectorsCreated: 0,
          processingTime: Date.now() - startTime,
          error: 'No content extracted',
        };
      }

      // Split content into chunks
      const textChunks = chunkText(content, {
        maxChunkSize: this.options.chunkSize!,
        overlapSize: this.options.overlapSize!,
      });

      logger.debug(`Split content into ${textChunks.length} chunks`);

      if (this.options.dryRun) {
        return {
          filePath,
          success: true,
          chunksProcessed: textChunks.length,
          vectorsCreated: 0,
          processingTime: Date.now() - startTime,
          metadata: {
            fileSize: fs.statSync(filePath).size,
            textLength: content.length,
            chunkCount: textChunks.length,
            embeddingDimension: 1536, // OpenAI text-embedding-ada-002
          },
        };
      }

      // Create vectors in batches
      const vectors = await this.createVectorsInBatches(filePath, textChunks, metadata);
      
      // Store vectors in database
      await vectorDB.upsertVectors(vectors);
      
      const processingTime = Date.now() - startTime;
      this.totalVectors += vectors.length;
      this.totalProcessingTime += processingTime;

      logger.info(`Successfully processed ${filePath}: ${vectors.length} vectors created`);

      return {
        filePath,
        success: true,
        chunksProcessed: textChunks.length,
        vectorsCreated: vectors.length,
        processingTime,
        metadata: {
          fileSize: fs.statSync(filePath).size,
          textLength: content.length,
          chunkCount: textChunks.length,
          embeddingDimension: 1536,
        },
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error(`Failed to process file ${filePath}:`, error);
      
      return {
        filePath,
        success: false,
        chunksProcessed: 0,
        vectorsCreated: 0,
        processingTime,
        error: errorMessage,
      };
    }
  }

  /**
   * Process all files in a directory
   */
  private async processDirectory(directoryPath: string): Promise<EmbeddingResult[]> {
    try {
      logger.info(`Processing directory: ${directoryPath}`);

      const files = this.getProcessableFiles(directoryPath);
      logger.info(`Found ${files.length} files to process`);

      const results: EmbeddingResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          logger.info(`Processing file ${i + 1}/${files.length}: ${file}`);
          
          const result = await this.processFile(file);
          results.push(result);
          
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }
          
        } catch (error) {
          logger.error(`Failed to process ${file}:`, error);
          results.push({
            filePath: file,
            success: false,
            chunksProcessed: 0,
            vectorsCreated: 0,
            processingTime: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          errorCount++;
          
          if (!this.options.force) {
            throw error;
          }
        }
      }

      logger.info(`Directory processing complete: ${successCount} successful, ${errorCount} failed`);
      return results;
      
    } catch (error) {
      logger.error(`Failed to process directory ${directoryPath}:`, error);
      throw error;
    }
  }

  /**
   * Validate file type
   */
  private validateFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const supportedFormats = ['.pdf', '.txt', '.md'];
    return supportedFormats.includes(ext);
  }

  /**
   * Extract metadata from filename
   */
  private extractMetadataFromFilename(filePath: string): Partial<VectorMetadata> {
    const filename = path.basename(filePath, path.extname(filePath));
    const parts = filename.split('-');
    
    let brand = this.options.brand;
    let component = this.options.component;
    
    // Try to extract brand and component from filename if not provided
    if (!brand && parts.length > 0) {
      brand = parts[0];
    }
    
    if (!component && parts.length > 1) {
      component = parts[1];
    }
    
    return { brand, component };
  }

  /**
   * Extract content from file
   */
  private async extractContent(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.pdf') {
      return await parsePDF(filePath);
    } else if (ext === '.txt' || ext === '.md') {
      return fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  }

  /**
   * Get all processable files in a directory
   */
  private getProcessableFiles(directoryPath: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(directoryPath);
    
    for (const item of items) {
      const fullPath = path.join(directoryPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        files.push(...this.getProcessableFiles(fullPath));
      } else if (stat.isFile() && this.validateFile(fullPath)) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Create vectors in batches to manage memory and API limits
   */
  private async createVectorsInBatches(
    filePath: string,
    textChunks: string[],
    metadata: Partial<VectorMetadata>
  ): Promise<VectorEntry[]> {
    const vectors: VectorEntry[] = [];
    const filename = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;
    const batchSize = this.options.batchSize!;
    
    for (let i = 0; i < textChunks.length; i += batchSize) {
      const batch = textChunks.slice(i, i + batchSize);
      logger.debug(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textChunks.length / batchSize)}`);
      
      const batchVectors = await this.createVectorsForBatch(
        batch,
        filename,
        metadata,
        fileSize,
        i
      );
      
      vectors.push(...batchVectors);
      
      // Add small delay between batches to be respectful to APIs
      if (i + batchSize < textChunks.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return vectors;
  }

  /**
   * Create vectors for a batch of text chunks
   */
  private async createVectorsForBatch(
    chunks: string[],
    filename: string,
    metadata: Partial<VectorMetadata>,
    fileSize: number,
    startIndex: number
  ): Promise<VectorEntry[]> {
    const vectors: VectorEntry[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkIndex = startIndex + i;
      
      try {
        // Generate embeddings
        const embeddings = await openaiClient.generateEmbeddings(chunk);
        
        const vectorMetadata: VectorMetadata = {
          brand: metadata.brand || 'Unknown',
          component: metadata.component || 'Unknown',
          manualType: this.options.manualType!,
          source: filename,
          chunkIndex,
          totalChunks: chunks.length + startIndex,
          createdAt: new Date().toISOString(),
          fileSize,
          pageNumber: Math.floor(chunkIndex / 10) + 1,
        };

        const vectorId = `${filename}-chunk-${chunkIndex}`;
        
        vectors.push({
          id: vectorId,
          values: embeddings,
          metadata: vectorMetadata,
        });
        
      } catch (error) {
        logger.error(`Failed to create vector for chunk ${chunkIndex}:`, error);
        throw error;
      }
    }
    
    return vectors;
  }

  /**
   * Generate processing summary
   */
  private generateSummary(results: EmbeddingResult[]): void {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    const totalChunks = results.reduce((sum, r) => sum + r.chunksProcessed, 0);
    const totalVectors = results.reduce((sum, r) => sum + r.vectorsCreated, 0);
    const totalTime = results.reduce((sum, r) => sum + r.processingTime, 0);

    logger.info('=== EMBEDDINGS BUILDING SUMMARY ===');
    logger.info(`Files processed: ${total}`);
    logger.info(`Successful: ${successful}`);
    logger.info(`Failed: ${failed}`);
    logger.info(`Total chunks: ${totalChunks}`);
    logger.info(`Total vectors created: ${totalVectors}`);
    logger.info(`Total processing time: ${totalTime}ms`);
    logger.info(`Average time per file: ${total > 0 ? Math.round(totalTime / total) : 0}ms`);
    logger.info(`Vectors per second: ${totalTime > 0 ? Math.round((totalVectors / totalTime) * 1000) : 0}`);
    logger.info('=====================================');
  }
}

// CLI setup
const program = new Command();

program
  .name('build-embeddings')
  .description('CLI tool for building and optimizing embeddings for the RAG pipeline')
  .version('1.0.0');

program
  .command('build <input-path>')
  .description('Build embeddings for files or directories')
  .option('-b, --brand <brand>', 'RV or component brand')
  .option('-c, --component <component>', 'Component type')
  .option('-t, --type <type>', 'Manual type (service, owner, parts, wiring)', 'service')
  .option('--chunk-size <size>', 'Maximum chunk size in characters', '1000')
  .option('--overlap-size <size>', 'Overlap size between chunks', '100')
  .option('--batch-size <size>', 'Batch size for processing', '100')
  .option('-s, --save', 'Save embeddings to file')
  .option('-o, --output <directory>', 'Output directory for saved files')
  .option('-u, --update', 'Update existing embeddings')
  .option('-f, --force', 'Continue processing even if errors occur')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--dry-run', 'Show what would be processed without actually processing')
  .action(async (inputPath, options) => {
    try {
      const builder = new EmbeddingsBuilder({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        chunkSize: parseInt(options.chunkSize),
        overlapSize: parseInt(options.overlapSize),
        batchSize: parseInt(options.batchSize),
        saveToFile: options.save,
        outputDir: options.output,
        updateExisting: options.update,
        force: options.force,
        verbose: options.verbose,
        dryRun: options.dryRun,
      });
      
      const results = await builder.buildEmbeddings(inputPath);
      
      if (results.some(r => r.success)) {
        logger.info('Embeddings building completed successfully');
        process.exit(0);
      } else {
        logger.error('No embeddings were built successfully');
        process.exit(1);
      }
    } catch (error) {
      logger.error('Embeddings building failed:', error);
      process.exit(1);
    }
  });

program
  .command('update [index-name]')
  .description('Update existing embeddings in the database')
  .option('-f, --force', 'Force update even if errors occur')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (indexName, options) => {
    try {
      const builder = new EmbeddingsBuilder({
        force: options.force,
        verbose: options.verbose,
        manualType: 'service', // Default value
      });
      
      await builder.updateEmbeddings(indexName);
      logger.info('Embeddings update completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Embeddings update failed:', error);
      process.exit(1);
    }
  });

program
  .command('optimize')
  .description('Optimize embeddings for better performance')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (options) => {
    try {
      const builder = new EmbeddingsBuilder({
        verbose: options.verbose,
        manualType: 'service', // Default value
      });
      
      await builder.optimizeEmbeddings();
      logger.info('Embeddings optimization completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Embeddings optimization failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}