import { Pinecone } from '@pinecone-database/pinecone';
import { logger } from '../utils/logger';

/**
 * Metadata structure for vector database entries
 */
export interface VectorMetadata {
  brand?: string;
  component?: string;
  manualType: 'service' | 'owner' | 'parts' | 'wiring';
  source: string;
  chunkIndex: number;
  totalChunks: number;
  createdAt: string;
  fileSize?: number;
  pageNumber?: number;
}

/**
 * Vector database entry structure
 */
export interface VectorEntry {
  id: string;
  values: number[];
  metadata: VectorMetadata;
}

/**
 * Search result structure
 */
export interface SearchResult {
  id: string;
  score: number;
  metadata: VectorMetadata;
  text: string;
}

/**
 * Pinecone vector database service
 */
class VectorDBService {
  private pinecone: Pinecone;
  private index: any;
  private indexName: string;
  private dimension: number;

  constructor() {
    const apiKey = process.env.PINECONE_API_KEY;
    const environment = process.env.PINECONE_ENV;
    
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }
    
    if (!environment) {
      throw new Error('PINECONE_ENV environment variable is required');
    }

    this.pinecone = new Pinecone({
      apiKey,
      environment,
    });

    this.indexName = process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals';
    this.dimension = 1536; // OpenAI text-embedding-ada-002 dimension
    
    logger.info(`Pinecone client initialized for index: ${this.indexName}`);
  }

  /**
   * Initialize the vector database index
   */
  async initializeIndex(): Promise<void> {
    try {
      const indexes = await this.pinecone.listIndexes();
      const indexExists = indexes.some(index => index.name === this.indexName);

      if (!indexExists) {
        logger.info(`Creating Pinecone index: ${this.indexName}`);
        
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: this.dimension,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1',
            },
          },
        });

        // Wait for index to be ready
        await this.waitForIndexReady();
      }

      this.index = this.pinecone.index(this.indexName);
      logger.info(`Pinecone index ${this.indexName} is ready`);
    } catch (error) {
      logger.error('Error initializing Pinecone index:', error);
      throw new Error(`Failed to initialize Pinecone index: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Wait for index to be ready
   */
  private async waitForIndexReady(): Promise<void> {
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      try {
        const index = this.pinecone.index(this.indexName);
        const stats = await index.describeIndexStats();
        
        if (stats.totalVectorCount !== undefined) {
          logger.info(`Index ${this.indexName} is ready`);
          return;
        }
      } catch (error) {
        // Index might not be ready yet
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    
    throw new Error(`Index ${this.indexName} did not become ready within expected time`);
  }

  /**
   * Upsert vectors to the database
   * @param vectors - Array of vector entries to upsert
   * @returns Promise<void>
   */
  async upsertVectors(vectors: VectorEntry[]): Promise<void> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      logger.info(`Upserting ${vectors.length} vectors to Pinecone`);
      
      const upsertRequest = vectors.map(vector => ({
        id: vector.id,
        values: vector.values,
        metadata: vector.metadata,
      }));

      // Pinecone has a limit of 100 vectors per upsert request
      const batchSize = 100;
      for (let i = 0; i < upsertRequest.length; i += batchSize) {
        const batch = upsertRequest.slice(i, i + batchSize);
        await this.index.upsert(batch);
        
        logger.debug(`Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(upsertRequest.length / batchSize)}`);
      }

      logger.info(`Successfully upserted ${vectors.length} vectors`);
    } catch (error) {
      logger.error('Error upserting vectors:', error);
      throw new Error(`Failed to upsert vectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for similar vectors
   * @param queryVector - The query vector to search for
   * @param topK - Number of top results to return
   * @param filter - Optional metadata filter
   * @returns Promise<SearchResult[]> - Array of search results
   */
  async searchVectors(
    queryVector: number[],
    topK: number = 5,
    filter?: Partial<VectorMetadata>
  ): Promise<SearchResult[]> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      logger.debug(`Searching for ${topK} similar vectors`);

      const searchResponse = await this.index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
        filter: filter ? this.buildFilter(filter) : undefined,
      });

      const results: SearchResult[] = searchResponse.matches?.map(match => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata as VectorMetadata,
        text: '', // This will be populated by the calling service
      })) || [];

      logger.debug(`Found ${results.length} search results`);
      return results;
    } catch (error) {
      logger.error('Error searching vectors:', error);
      throw new Error(`Failed to search vectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Build Pinecone filter from metadata
   * @param filter - Partial metadata filter
   * @returns Pinecone filter object
   */
  private buildFilter(filter: Partial<VectorMetadata>): any {
    const pineconeFilter: any = {};

    if (filter.brand) {
      pineconeFilter.brand = { $eq: filter.brand };
    }
    
    if (filter.component) {
      pineconeFilter.component = { $eq: filter.component };
    }
    
    if (filter.manualType) {
      pineconeFilter.manualType = { $eq: filter.manualType };
    }

    return pineconeFilter;
  }

  /**
   * Get index statistics
   * @returns Promise<any> - Index statistics
   */
  async getIndexStats(): Promise<any> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      const stats = await this.index.describeIndexStats();
      return stats;
    } catch (error) {
      logger.error('Error getting index stats:', error);
      throw new Error(`Failed to get index stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete vectors by filter
   * @param filter - Metadata filter for deletion
   * @returns Promise<void>
   */
  async deleteVectors(filter: Partial<VectorMetadata>): Promise<void> {
    try {
      if (!this.index) {
        await this.initializeIndex();
      }

      logger.info(`Deleting vectors with filter:`, filter);
      
      await this.index.delete1({
        filter: this.buildFilter(filter),
      });

      logger.info('Successfully deleted vectors');
    } catch (error) {
      logger.error('Error deleting vectors:', error);
      throw new Error(`Failed to delete vectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const vectorDB = new VectorDBService();
export default vectorDB;