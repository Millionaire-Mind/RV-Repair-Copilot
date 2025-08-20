#!/usr/bin/env ts-node

/**
 * RV Repair Copilot - Manual Ingestion CLI Tool
 * 
 * This script processes PDF service manuals and ingests them into the vector database.
 * It can process individual files or entire directories of PDFs.
 * 
 * Usage:
 *   npm run ingest:file <pdf-path> [options]
 *   npm run ingest:directory <directory-path> [options]
 *   npm run ingest:batch <csv-file> [options]
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
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

interface IngestionOptions {
  brand?: string;
  component?: string;
  manualType: 'service' | 'owner' | 'parts' | 'wiring';
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

interface BatchIngestionRecord {
  filePath: string;
  brand: string;
  component: string;
  manualType: 'service' | 'owner' | 'parts' | 'wiring';
  description?: string;
}

class ManualIngestionTool {
  private options: IngestionOptions;

  constructor(options: IngestionOptions) {
    this.options = options;
    
    if (options.verbose) {
      logger.level = 'debug';
    }
  }

  /**
   * Ingest a single PDF file
   */
  async ingestFile(filePath: string): Promise<void> {
    try {
      logger.info(`Processing PDF file: ${filePath}`);

      // Validate file exists and is PDF
      if (!this.validateFile(filePath)) {
        return;
      }

      // Extract metadata from filename if not provided
      const metadata = this.extractMetadataFromFilename(filePath);
      
      // Parse PDF and extract text
      const pdfText = await parsePDF(filePath);
      if (!pdfText || pdfText.trim().length === 0) {
        logger.warn(`No text content extracted from: ${filePath}`);
        return;
      }

      // Split text into chunks
      const textChunks = chunkText(pdfText);
      logger.info(`Split text into ${textChunks.length} chunks`);

      if (this.options.dryRun) {
        logger.info(`DRY RUN: Would process ${textChunks.length} chunks for ${filePath}`);
        return;
      }

      // Generate embeddings and create vectors
      const vectors = await this.createVectors(filePath, textChunks, metadata);
      
      // Store vectors in database
      await vectorDB.upsertVectors(vectors);
      
      logger.info(`Successfully ingested ${filePath}: ${vectors.length} vectors stored`);
      
    } catch (error) {
      logger.error(`Failed to ingest file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Ingest all PDFs in a directory
   */
  async ingestDirectory(directoryPath: string): Promise<void> {
    try {
      logger.info(`Processing directory: ${directoryPath}`);

      if (!fs.existsSync(directoryPath)) {
        throw new Error(`Directory does not exist: ${directoryPath}`);
      }

      const files = this.getPDFFiles(directoryPath);
      logger.info(`Found ${files.length} PDF files to process`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          logger.info(`Processing file ${i + 1}/${files.length}: ${file}`);
          await this.ingestFile(file);
          successCount++;
        } catch (error) {
          logger.error(`Failed to process ${file}:`, error);
          errorCount++;
          
          if (!this.options.force) {
            throw error;
          }
        }
      }

      logger.info(`Directory processing complete: ${successCount} successful, ${errorCount} failed`);
      
    } catch (error) {
      logger.error(`Failed to process directory ${directoryPath}:`, error);
      throw error;
    }
  }

  /**
   * Ingest PDFs from a CSV batch file
   */
  async ingestBatch(csvFilePath: string): Promise<void> {
    try {
      logger.info(`Processing batch CSV file: ${csvFilePath}`);

      if (!fs.existsSync(csvFilePath)) {
        throw new Error(`CSV file does not exist: ${csvFilePath}`);
      }

      const records: BatchIngestionRecord[] = [];
      
      // Parse CSV file
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(csvFilePath)
          .pipe(csv())
          .on('data', (data) => records.push(data))
          .on('end', () => resolve())
          .on('error', reject);
      });

      logger.info(`Found ${records.length} records in CSV file`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < records.length; i++) {
        const record = records[i];
        try {
          logger.info(`Processing record ${i + 1}/${records.length}: ${record.filePath}`);
          
          if (!fs.existsSync(record.filePath)) {
            logger.warn(`File not found: ${record.filePath}`);
            errorCount++;
            continue;
          }

          // Override options with CSV data
          const recordOptions = {
            ...this.options,
            brand: record.brand,
            component: record.component,
            manualType: record.manualType,
          };

          const ingestionTool = new ManualIngestionTool(recordOptions);
          await ingestionTool.ingestFile(record.filePath);
          successCount++;
          
        } catch (error) {
          logger.error(`Failed to process record ${i + 1}:`, error);
          errorCount++;
          
          if (!this.options.force) {
            throw error;
          }
        }
      }

      logger.info(`Batch processing complete: ${successCount} successful, ${errorCount} failed`);
      
    } catch (error) {
      logger.error(`Failed to process batch CSV ${csvFilePath}:`, error);
      throw error;
    }
  }

  /**
   * Validate file exists and is PDF
   */
  private validateFile(filePath: string): boolean {
    if (!fs.existsSync(filePath)) {
      logger.error(`File does not exist: ${filePath}`);
      return false;
    }

    if (path.extname(filePath).toLowerCase() !== '.pdf') {
      logger.error(`File is not a PDF: ${filePath}`);
      return false;
    }

    return true;
  }

  /**
   * Extract metadata from filename
   */
  private extractMetadataFromFilename(filePath: string): Partial<VectorMetadata> {
    const filename = path.basename(filePath, '.pdf');
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
   * Get all PDF files in a directory
   */
  private getPDFFiles(directoryPath: string): string[] {
    const files: string[] = [];
    
    const items = fs.readdirSync(directoryPath);
    
    for (const item of items) {
      const fullPath = path.join(directoryPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Recursively process subdirectories
        files.push(...this.getPDFFiles(fullPath));
      } else if (stat.isFile() && path.extname(item).toLowerCase() === '.pdf') {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  /**
   * Create vector entries from text chunks
   */
  private async createVectors(
    filePath: string,
    textChunks: string[],
    metadata: Partial<VectorMetadata>
  ): Promise<VectorEntry[]> {
    const vectors: VectorEntry[] = [];
    const filename = path.basename(filePath);
    const fileSize = fs.statSync(filePath).size;
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      
      try {
        // Generate embeddings
        const embeddings = await openaiClient.generateEmbeddings(chunk);
        
        const vectorMetadata: VectorMetadata = {
          brand: metadata.brand || 'Unknown',
          component: metadata.component || 'Unknown',
          manualType: this.options.manualType,
          source: filename,
          chunkIndex: i,
          totalChunks: textChunks.length,
          createdAt: new Date().toISOString(),
          fileSize,
          pageNumber: Math.floor(i / 10) + 1, // Approximate page number
        };

        const vectorId = `${filename}-chunk-${i}`;
        
        vectors.push({
          id: vectorId,
          values: embeddings,
          metadata: vectorMetadata,
        });

        // Log progress for large files
        if (textChunks.length > 50 && i % 10 === 0) {
          logger.debug(`Processed ${i + 1}/${textChunks.length} chunks`);
        }
        
      } catch (error) {
        logger.error(`Failed to create vector for chunk ${i}:`, error);
        throw error;
      }
    }
    
    return vectors;
  }
}

// CLI setup
const program = new Command();

program
  .name('ingest-manuals')
  .description('CLI tool for ingesting PDF service manuals into the vector database')
  .version('1.0.0');

program
  .command('file <pdf-path>')
  .description('Ingest a single PDF file')
  .option('-b, --brand <brand>', 'RV or component brand')
  .option('-c, --component <component>', 'Component type')
  .option('-t, --type <type>', 'Manual type (service, owner, parts, wiring)', 'service')
  .option('-f, --force', 'Continue processing even if errors occur')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--dry-run', 'Show what would be processed without actually processing')
  .action(async (pdfPath, options) => {
    try {
      const ingestionTool = new ManualIngestionTool({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        force: options.force,
        verbose: options.verbose,
        dryRun: options.dryRun,
      });
      
      await ingestionTool.ingestFile(pdfPath);
      logger.info('File ingestion completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('File ingestion failed:', error);
      process.exit(1);
    }
  });

program
  .command('directory <directory-path>')
  .description('Ingest all PDFs in a directory')
  .option('-b, --brand <brand>', 'Default RV or component brand')
  .option('-c, --component <component>', 'Default component type')
  .option('-t, --type <type>', 'Default manual type (service, owner, parts, wiring)', 'service')
  .option('-f, --force', 'Continue processing even if errors occur')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--dry-run', 'Show what would be processed without actually processing')
  .action(async (directoryPath, options) => {
    try {
      const ingestionTool = new ManualIngestionTool({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        force: options.force,
        verbose: options.verbose,
        dryRun: options.dryRun,
      });
      
      await ingestionTool.ingestDirectory(directoryPath);
      logger.info('Directory ingestion completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Directory ingestion failed:', error);
      process.exit(1);
    }
  });

program
  .command('batch <csv-file>')
  .description('Ingest PDFs from a CSV batch file')
  .option('-t, --type <type>', 'Default manual type (service, owner, parts, wiring)', 'service')
  .option('-f, --force', 'Continue processing even if errors occur')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('--dry-run', 'Show what would be processed without actually processing')
  .action(async (csvFile, options) => {
    try {
      const ingestionTool = new ManualIngestionTool({
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        force: options.force,
        verbose: options.verbose,
        dryRun: options.dryRun,
      });
      
      await ingestionTool.ingestBatch(csvFile);
      logger.info('Batch ingestion completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Batch ingestion failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}