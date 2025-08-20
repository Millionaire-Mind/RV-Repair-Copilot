#!/usr/bin/env ts-node

/**
 * RV Repair Copilot - Web Scraping CLI Tool
 * 
 * This script scrapes trusted RV OEM and component websites to extract
 * repair information and technical documentation.
 * 
 * Usage:
 *   npm run scrape:url <url> [options]
 *   npm run scrape:list <urls-file> [options]
 *   npm run scrape:discover <domain> [options]
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../backend/src/utils/logger';
import { webScraper, ScrapedContent } from '../backend/src/utils/scraper';
import { chunkText } from '../backend/src/utils/textChunker';
import { openaiClient } from '../backend/src/services/openaiClient';
import { vectorDB, VectorEntry, VectorMetadata } from '../backend/src/services/vectorDB';

// Load environment variables
dotenv.config();

// Configure logging for CLI
logger.level = 'info';

interface ScrapingOptions {
  brand?: string;
  component?: string;
  manualType: 'service' | 'owner' | 'parts' | 'wiring';
  saveToFile?: boolean;
  outputDir?: string;
  ingestToDB?: boolean;
  force?: boolean;
  verbose?: boolean;
  delay?: number;
}

interface ScrapingResult {
  url: string;
  success: boolean;
  content?: ScrapedContent;
  error?: string;
  processingTime: number;
}

class WebScrapingTool {
  private options: ScrapingOptions;

  constructor(options: ScrapingOptions) {
    this.options = {
      delay: 2000, // Default 2 second delay between requests
      ...options,
    };
    
    if (options.verbose) {
      logger.level = 'debug';
    }
  }

  /**
   * Scrape a single URL
   */
  async scrapeURL(url: string): Promise<ScrapingResult> {
    const startTime = Date.now();
    
    try {
      logger.info(`Scraping URL: ${url}`);

      // Validate URL
      if (!this.validateURL(url)) {
        return {
          url,
          success: false,
          error: 'Invalid URL format',
          processingTime: Date.now() - startTime,
        };
      }

      // Check if domain is trusted
      if (!webScraper.isTrustedDomain(url)) {
        logger.warn(`URL is not from a trusted domain: ${url}`);
        if (!this.options.force) {
          return {
            url,
            success: false,
            error: 'URL is not from a trusted domain',
            processingTime: Date.now() - startTime,
          };
        }
      }

      // Scrape the content
      const content = await webScraper.scrapeURL(url);
      
      // Save to file if requested
      if (this.options.saveToFile) {
        await this.saveContentToFile(content);
      }

      // Ingest to database if requested
      if (this.options.ingestToDB) {
        await this.ingestContentToDB(content);
      }

      const processingTime = Date.now() - startTime;
      logger.info(`Successfully scraped ${url} in ${processingTime}ms`);

      return {
        url,
        success: true,
        content,
        processingTime,
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error(`Failed to scrape ${url}:`, error);
      
      return {
        url,
        success: false,
        error: errorMessage,
        processingTime,
      };
    }
  }

  /**
   * Scrape multiple URLs from a file
   */
  async scrapeFromFile(urlsFilePath: string): Promise<ScrapingResult[]> {
    try {
      logger.info(`Processing URLs from file: ${urlsFilePath}`);

      if (!fs.existsSync(urlsFilePath)) {
        throw new Error(`URLs file does not exist: ${urlsFilePath}`);
      }

      const urls = this.readURLsFromFile(urlsFilePath);
      logger.info(`Found ${urls.length} URLs to process`);

      const results: ScrapingResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i].trim();
        
        if (!url || url.startsWith('#')) {
          continue; // Skip empty lines and comments
        }

        try {
          logger.info(`Processing URL ${i + 1}/${urls.length}: ${url}`);
          
          const result = await this.scrapeURL(url);
          results.push(result);
          
          if (result.success) {
            successCount++;
          } else {
            errorCount++;
          }

          // Add delay between requests
          if (i < urls.length - 1 && this.options.delay) {
            logger.debug(`Waiting ${this.options.delay}ms before next request`);
            await new Promise(resolve => setTimeout(resolve, this.options.delay));
          }
          
        } catch (error) {
          logger.error(`Failed to process URL ${url}:`, error);
          results.push({
            url,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            processingTime: 0,
          });
          errorCount++;
        }
      }

      logger.info(`File processing complete: ${successCount} successful, ${errorCount} failed`);
      return results;
      
    } catch (error) {
      logger.error(`Failed to process URLs file ${urlsFilePath}:`, error);
      throw error;
    }
  }

  /**
   * Discover and scrape content from a domain
   */
  async discoverAndScrape(domain: string): Promise<ScrapingResult[]> {
    try {
      logger.info(`Discovering content from domain: ${domain}`);

      // This is a simplified discovery - in a real implementation,
      // you would crawl the site to find relevant pages
      const discoveredURLs = await this.discoverURLs(domain);
      logger.info(`Discovered ${discoveredURLs.length} URLs from ${domain}`);

      const results: ScrapingResult[] = [];
      
      for (let i = 0; i < discoveredURLs.length; i++) {
        const url = discoveredURLs[i];
        
        try {
          logger.info(`Processing discovered URL ${i + 1}/${discoveredURLs.length}: ${url}`);
          
          const result = await this.scrapeURL(url);
          results.push(result);
          
          // Add delay between requests
          if (i < discoveredURLs.length - 1 && this.options.delay) {
            await new Promise(resolve => setTimeout(resolve, this.options.delay));
          }
          
        } catch (error) {
          logger.error(`Failed to process discovered URL ${url}:`, error);
          results.push({
            url,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            processingTime: 0,
          });
        }
      }

      return results;
      
    } catch (error) {
      logger.error(`Failed to discover and scrape from domain ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Validate URL format
   */
  private validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Read URLs from a file
   */
  private readURLsFromFile(filePath: string): string[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }

  /**
   * Save scraped content to file
   */
  private async saveContentToFile(content: ScrapedContent): Promise<void> {
    try {
      const outputDir = this.options.outputDir || './scraped-content';
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const filename = this.generateFilename(content);
      const filePath = path.join(outputDir, filename);
      
      const fileContent = {
        ...content,
        scrapedAt: new Date().toISOString(),
      };

      fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2));
      logger.debug(`Saved content to: ${filePath}`);
      
    } catch (error) {
      logger.error('Failed to save content to file:', error);
      throw error;
    }
  }

  /**
   * Generate filename for scraped content
   */
  private generateFilename(content: ScrapedContent): string {
    const domain = new URL(content.url).hostname;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const brand = content.metadata.brand || 'unknown';
    const component = content.metadata.component || 'unknown';
    
    return `${domain}-${brand}-${component}-${timestamp}.json`;
  }

  /**
   * Ingest scraped content to vector database
   */
  private async ingestContentToDB(content: ScrapedContent): Promise<void> {
    try {
      logger.info(`Ingesting content to vector database: ${content.url}`);

      // Split content into chunks
      const textChunks = chunkText(content.content);
      logger.debug(`Split content into ${textChunks.length} chunks`);

      // Create vectors
      const vectors = await this.createVectors(content, textChunks);
      
      // Store in database
      await vectorDB.upsertVectors(vectors);
      
      logger.info(`Successfully ingested ${vectors.length} vectors for ${content.url}`);
      
    } catch (error) {
      logger.error('Failed to ingest content to database:', error);
      throw error;
    }
  }

  /**
   * Create vector entries from scraped content
   */
  private async createVectors(
    content: ScrapedContent,
    textChunks: string[]
  ): Promise<VectorEntry[]> {
    const vectors: VectorEntry[] = [];
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      
      try {
        // Generate embeddings
        const embeddings = await openaiClient.generateEmbeddings(chunk);
        
        const metadata: VectorMetadata = {
          brand: content.metadata.brand || 'Unknown',
          component: content.metadata.component || 'Unknown',
          manualType: this.options.manualType,
          source: content.url,
          chunkIndex: i,
          totalChunks: textChunks.length,
          createdAt: new Date().toISOString(),
          fileSize: content.metadata.size,
        };

        const vectorId = `scraped-${content.url.replace(/[^a-zA-Z0-9]/g, '-')}-chunk-${i}`;
        
        vectors.push({
          id: vectorId,
          values: embeddings,
          metadata,
        });

        // Log progress for large content
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

  /**
   * Discover URLs from a domain (simplified implementation)
   */
  private async discoverURLs(domain: string): Promise<string[]> {
    // This is a mock implementation - in production, you would:
    // 1. Start with the main page
    // 2. Extract links to relevant pages
    // 3. Follow links to find repair-related content
    // 4. Respect robots.txt and rate limiting
    
    const baseURL = domain.startsWith('http') ? domain : `https://${domain}`;
    
    // Mock discovered URLs - replace with actual crawling logic
    const mockURLs = [
      `${baseURL}/service`,
      `${baseURL}/repair`,
      `${baseURL}/manuals`,
      `${baseURL}/troubleshooting`,
      `${baseURL}/parts`,
      `${baseURL}/support`,
    ];

    logger.info(`Mock discovery found ${mockURLs.length} URLs (replace with actual crawling)`);
    return mockURLs;
  }

  /**
   * Generate scraping report
   */
  generateReport(results: ScrapingResult[]): any {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    const totalTime = results.reduce((sum, r) => sum + r.processingTime, 0);
    const avgTime = total > 0 ? totalTime / total : 0;

    const report = {
      summary: {
        total,
        successful,
        failed,
        successRate: total > 0 ? (successful / total * 100).toFixed(2) + '%' : '0%',
        totalProcessingTime: totalTime,
        averageProcessingTime: Math.round(avgTime),
      },
      results: results.map(r => ({
        url: r.url,
        success: r.success,
        processingTime: r.processingTime,
        error: r.error,
      })),
      timestamp: new Date().toISOString(),
    };

    return report;
  }
}

// CLI setup
const program = new Command();

program
  .name('scrape-sources')
  .description('CLI tool for scraping trusted RV OEM and component websites')
  .version('1.0.0');

program
  .command('url <url>')
  .description('Scrape a single URL')
  .option('-b, --brand <brand>', 'RV or component brand')
  .option('-c, --component <component>', 'Component type')
  .option('-t, --type <type>', 'Manual type (service, owner, parts, wiring)', 'service')
  .option('-s, --save', 'Save scraped content to file')
  .option('-o, --output <directory>', 'Output directory for saved files')
  .option('-i, --ingest', 'Ingest scraped content to vector database')
  .option('-f, --force', 'Process untrusted domains')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-d, --delay <ms>', 'Delay between requests in milliseconds', '2000')
  .action(async (url, options) => {
    try {
      const scrapingTool = new WebScrapingTool({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        saveToFile: options.save,
        outputDir: options.output,
        ingestToDB: options.ingest,
        force: options.force,
        verbose: options.verbose,
        delay: parseInt(options.delay),
      });
      
      const result = await scrapingTool.scrapeURL(url);
      
      if (result.success) {
        logger.info('URL scraping completed successfully');
        process.exit(0);
      } else {
        logger.error('URL scraping failed:', result.error);
        process.exit(1);
      }
    } catch (error) {
      logger.error('URL scraping failed:', error);
      process.exit(1);
    }
  });

program
  .command('list <urls-file>')
  .description('Scrape URLs from a file (one URL per line)')
  .option('-b, --brand <brand>', 'Default RV or component brand')
  .option('-c, --component <component>', 'Default component type')
  .option('-t, --type <type>', 'Default manual type (service, owner, parts, wiring)', 'service')
  .option('-s, --save', 'Save scraped content to files')
  .option('-o, --output <directory>', 'Output directory for saved files')
  .option('-i, --ingest', 'Ingest scraped content to vector database')
  .option('-f, --force', 'Process untrusted domains')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-d, --delay <ms>', 'Delay between requests in milliseconds', '2000')
  .action(async (urlsFile, options) => {
    try {
      const scrapingTool = new WebScrapingTool({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        saveToFile: options.save,
        outputDir: options.output,
        ingestToDB: options.ingest,
        force: options.force,
        verbose: options.verbose,
        delay: parseInt(options.delay),
      });
      
      const results = await scrapingTool.scrapeFromFile(urlsFile);
      const report = scrapingTool.generateReport(results);
      
      logger.info('Batch scraping completed');
      logger.info('Report:', report.summary);
      
      // Save report to file
      const reportPath = `./scraping-report-${Date.now()}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      logger.info(`Report saved to: ${reportPath}`);
      
      process.exit(0);
    } catch (error) {
      logger.error('Batch scraping failed:', error);
      process.exit(1);
    }
  });

program
  .command('discover <domain>')
  .description('Discover and scrape content from a domain')
  .option('-b, --brand <brand>', 'Default RV or component brand')
  .option('-c, --component <component>', 'Default component type')
  .option('-t, --type <type>', 'Default manual type (service, owner, parts, wiring)', 'service')
  .option('-s, --save', 'Save scraped content to files')
  .option('-o, --output <directory>', 'Output directory for saved files')
  .option('-i, --ingest', 'Ingest scraped content to vector database')
  .option('-f, --force', 'Process untrusted domains')
  .option('-v, --verbose', 'Enable verbose logging')
  .option('-d, --delay <ms>', 'Delay between requests in milliseconds', '2000')
  .action(async (domain, options) => {
    try {
      const scrapingTool = new WebScrapingTool({
        brand: options.brand,
        component: options.component,
        manualType: options.type as 'service' | 'owner' | 'parts' | 'wiring',
        saveToFile: options.save,
        outputDir: options.output,
        ingestToDB: options.ingest,
        force: options.force,
        verbose: options.verbose,
        delay: parseInt(options.delay),
      });
      
      const results = await scrapingTool.discoverAndScrape(domain);
      const report = scrapingTool.generateReport(results);
      
      logger.info('Domain discovery and scraping completed');
      logger.info('Report:', report.summary);
      
      // Save report to file
      const reportPath = `./discovery-report-${domain}-${Date.now()}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      logger.info(`Report saved to: ${reportPath}`);
      
      process.exit(0);
    } catch (error) {
      logger.error('Domain discovery and scraping failed:', error);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}