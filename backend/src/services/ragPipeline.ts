import { openaiClient } from './openaiClient';
import { vectorDB, SearchResult } from './vectorDB';
import { logger } from '../utils/logger';

/**
 * Query request structure
 */
export interface QueryRequest {
  question: string;
  brand?: string;
  component?: string;
  manualType?: 'service' | 'owner' | 'parts' | 'wiring';
}

/**
 * Query response structure
 */
export interface QueryResponse {
  answer: string;
  sources: string[];
  metadata: {
    question: string;
    searchResults: number;
    processingTime: number;
    modelUsed: string;
  };
}

/**
 * RAG Pipeline Service - Orchestrates retrieval and generation
 */
class RAGPipelineService {
  /**
   * Process a user query through the RAG pipeline
   * @param request - The query request
   * @returns Promise<QueryResponse> - The generated answer with sources
   */
  async processQuery(request: QueryRequest): Promise<QueryResponse> {
    const startTime = Date.now();
    
    try {
      logger.info(`Processing query: "${request.question}"`);
      
      // Step 1: Generate embeddings for the question
      const questionEmbeddings = await openaiClient.generateEmbeddings(request.question);
      logger.debug('Generated question embeddings');
      
      // Step 2: Search for relevant context in vector database
      const searchResults = await this.retrieveContext(
        questionEmbeddings,
        request.brand,
        request.component,
        request.manualType
      );
      
      if (searchResults.length === 0) {
        logger.warn('No relevant context found for query');
        return {
          answer: 'I apologize, but I could not find any relevant information in our RV repair manuals to answer your question. Please try rephrasing your question or contact a qualified RV technician for assistance.',
          sources: [],
          metadata: {
            question: request.question,
            searchResults: 0,
            processingTime: Date.now() - startTime,
            modelUsed: openaiClient.getModelInfo().chatModel,
          },
        };
      }
      
      // Step 3: Extract text content from search results
      const contextTexts = await this.extractContextTexts(searchResults);
      
      // Step 4: Generate answer using OpenAI
      const answer = await openaiClient.generateRepairAnswer(request.question, contextTexts);
      
      // Step 5: Extract source information
      const sources = this.extractSources(searchResults);
      
      const processingTime = Date.now() - startTime;
      logger.info(`Query processed successfully in ${processingTime}ms`);
      
      return {
        answer,
        sources,
        metadata: {
          question: request.question,
          searchResults: searchResults.length,
          processingTime,
          modelUsed: openaiClient.getModelInfo().chatModel,
        },
      };
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      logger.error(`Error processing query after ${processingTime}ms:`, error);
      
      throw new Error(`Failed to process query: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Retrieve relevant context from vector database
   * @param queryEmbeddings - The query embeddings
   * @param brand - Optional brand filter
   * @param component - Optional component filter
   * @param manualType - Optional manual type filter
   * @returns Promise<SearchResult[]> - Array of search results
   */
  private async retrieveContext(
    queryEmbeddings: number[],
    brand?: string,
    component?: string,
    manualType?: 'service' | 'owner' | 'parts' | 'wiring'
  ): Promise<SearchResult[]> {
    try {
      const filter: any = {};
      
      if (brand) filter.brand = brand;
      if (component) filter.component = component;
      if (manualType) filter.manualType = manualType;
      
      // Search for top 5 most relevant chunks
      const searchResults = await vectorDB.searchVectors(
        queryEmbeddings,
        5,
        Object.keys(filter).length > 0 ? filter : undefined
      );
      
      // Filter results by relevance score (minimum 0.7)
      const relevantResults = searchResults.filter(result => result.score >= 0.7);
      
      if (relevantResults.length === 0) {
        logger.warn('No results met minimum relevance threshold');
        // Fall back to top results even if below threshold
        return searchResults.slice(0, 3);
      }
      
      return relevantResults;
      
    } catch (error) {
      logger.error('Error retrieving context:', error);
      throw error;
    }
  }

  /**
   * Extract text content from search results
   * @param searchResults - Array of search results
   * @returns Promise<string[]> - Array of context texts
   */
  private async extractContextTexts(searchResults: SearchResult[]): Promise<string[]> {
    try {
      // For now, we'll use the metadata to reconstruct context
      // In a full implementation, you'd store the actual text content
      // and retrieve it from a separate storage system
      
      const contextTexts = searchResults.map((result, index) => {
        const metadata = result.metadata;
        return `Context ${index + 1} (Score: ${result.score.toFixed(3)}):
Source: ${metadata.source}
Brand: ${metadata.brand || 'Unknown'}
Component: ${metadata.component || 'Unknown'}
Manual Type: ${metadata.manualType}
Page: ${metadata.pageNumber || 'Unknown'}`;
      });
      
      return contextTexts;
      
    } catch (error) {
      logger.error('Error extracting context texts:', error);
      throw error;
    }
  }

  /**
   * Extract source information from search results
   * @param searchResults - Array of search results
   * @returns string[] - Array of source identifiers
   */
  private extractSources(searchResults: SearchResult[]): string[] {
    try {
      const sources = new Set<string>();
      
      searchResults.forEach(result => {
        const metadata = result.metadata;
        const sourceInfo = `${metadata.source}${metadata.brand ? ` - ${metadata.brand}` : ''}${metadata.component ? ` (${metadata.component})` : ''}`;
        sources.add(sourceInfo);
      });
      
      return Array.from(sources);
      
    } catch (error) {
      logger.error('Error extracting sources:', error);
      return [];
    }
  }

  /**
   * Get pipeline statistics
   * @returns Promise<any> - Pipeline statistics
   */
  async getPipelineStats(): Promise<any> {
    try {
      const [indexStats, modelInfo] = await Promise.all([
        vectorDB.getIndexStats(),
        Promise.resolve(openaiClient.getModelInfo()),
      ]);
      
      return {
        vectorDatabase: {
          indexName: process.env.PINECONE_INDEX_NAME || 'rv-repair-manuals',
          totalVectors: indexStats.totalVectorCount || 0,
          dimension: indexStats.dimension || 1536,
        },
        openai: modelInfo,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      logger.error('Error getting pipeline stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ragPipeline = new RAGPipelineService();
export default ragPipeline;