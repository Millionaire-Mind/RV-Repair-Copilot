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
    const environment = process.env.PINECONE_ENVIRONMENT;

    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is required');
    }

    if (!environment) {
      throw new Error('PINECONE_ENVIRONMENT environment variable is required');
    }

    this.pinecone = new Pinecone({ apiKey, environment });
    this.indexName = process.env.PINECONE_INDEX || 'rv-repair-manuals';
    this.dimension = 1536; // OpenAI text-embedding-ada-002 dimension

    logger.info(`Pinecone client initialized for index: ${this.indexName}`);
  }

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
            serverless: { cloud: 'aws', region: 'us-east-1' },
          },
        });
        await this.waitForIndexReady();
      }

      this.index = this.pinecone.index(this.indexName);
      logger.info(`Pinecone index ${this.indexName} is ready`);
    } catch (error) {
      logger.error('Error initializing Pinecone index:', error);
      throw new Error(`Failed to initialize Pinecone index: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

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
      } catch {
        // Index might not be ready yet
      }
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error(`Index ${this.indexName} did not become ready within expected time`);
  }

  async upsertVectors(vectors: VectorEntry[]): Promise<void> {
    try {
      if (!this.index) await this.initializeIndex();

      logger.info(`Upserting ${vectors.length} vectors to Pinecone`);

      const batchSize = 100;
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize).map(vector => ({
          id: vector.id,
          values: vector.values,
          metadata: vector.metadata,
        }));
        await this.index.upsert(batch);
        logger.debug(`Upserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vectors.length / batchSize)}`);
      }

      logger.info(`Successfully upserted ${vectors.length} vectors`);
    } catch (error) {
      logger.error('Error upserting vectors:', error);
      throw new Error(`Failed to upsert vectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchVectors(queryVector: number[], topK = 5, filter?: Partial<VectorMetadata>): Promise<SearchResult[]> {
    try {
      if (!this.index) await this.initializeIndex();

      const searchResponse = await this.index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
        filter: filter ? this.buildFilter(filter) : undefined,
      });

      return searchResponse.matches?.map(match => ({
        id: match.id,
        score: match.score || 0,
        metadata: match.metadata as VectorMetadata,
        text: '',
      })) || [];
    } catch (error) {
      logger.error('Error searching vectors:', error);
      throw new Error(`Failed to search vectors: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildFilter(filter: Partial<VectorMetadata>): any {
    const pineconeFilter: any = {};
    if (filter.brand) pineconeFilter.brand = { $eq: filter.brand };
    if (filter.component) pineconeFilter.component = { $eq: filter.component };
    if (filter.manualType) pineconeFilter.manualType = { $eq: filter.manualType };
    return pineconeFilter;
  }

  async getIndexStats(): Promise<any> {
    if (!this.index) await this.initializeIndex();
    return this.index.describeIndexStats();
  }

  async deleteVectors(filter: Partial<VectorMetadata>): Promise<void> {
    if (!this.index) await this.initializeIndex();
    await this.index.delete1({ filter: this.buildFilter(filter) });
    logger.info('Successfully deleted vectors');
  }
}

// Export singleton instance
export const vectorDB = new VectorDBService();
export default vectorDB;
