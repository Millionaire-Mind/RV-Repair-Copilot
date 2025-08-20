import OpenAI from 'openai';
import { logger } from '../utils/logger';

/**
 * OpenAI client configuration and service methods
 */
class OpenAIClient {
  private client: OpenAI;
  private model: string;
  private embeddingModel: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.client = new OpenAI({
      apiKey,
      maxRetries: 3,
      timeout: 60000, // 60 seconds
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4-1106-preview';
    this.embeddingModel = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-ada-002';
    
    logger.info(`OpenAI client initialized with model: ${this.model}, embedding model: ${this.embeddingModel}`);
  }

  /**
   * Generate embeddings for text using OpenAI's embedding model
   * @param text - The text to generate embeddings for
   * @returns Promise<string[]> - Array of embedding values
   */
  async generateEmbeddings(text: string): Promise<number[]> {
    try {
      logger.debug(`Generating embeddings for text of length: ${text.length}`);
      
      const response = await this.client.embeddings.create({
        model: this.embeddingModel,
        input: text,
      });

      const embeddings = response.data[0]?.embedding;
      
      if (!embeddings) {
        throw new Error('No embeddings returned from OpenAI');
      }

      logger.debug(`Successfully generated embeddings of dimension: ${embeddings.length}`);
      return embeddings;
    } catch (error) {
      logger.error('Error generating embeddings:', error);
      throw new Error(`Failed to generate embeddings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a chat completion response using OpenAI's GPT model
   * @param messages - Array of chat messages
   * @param systemPrompt - Optional system prompt to guide the model
   * @returns Promise<string> - The generated response
   */
  async generateChatCompletion(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    systemPrompt?: string
  ): Promise<string> {
    try {
      const allMessages = systemPrompt 
        ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
        : messages;

      logger.debug(`Generating chat completion with ${allMessages.length} messages`);

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: allMessages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content returned from OpenAI chat completion');
      }

      logger.debug(`Successfully generated chat completion of length: ${content.length}`);
      return content;
    } catch (error) {
      logger.error('Error generating chat completion:', error);
      throw new Error(`Failed to generate chat completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a step-by-step repair answer based on retrieved context
   * @param question - The user's repair question
   * @param context - Retrieved context from vector database
   * @returns Promise<string> - Step-by-step repair instructions
   */
  async generateRepairAnswer(question: string, context: string[]): Promise<string> {
    const systemPrompt = `You are an expert RV repair technician with decades of experience. 
    Your task is to provide clear, step-by-step repair instructions based on the provided context.
    
    Guidelines:
    - Always prioritize safety first
    - Provide specific, actionable steps
    - Include any necessary tools or parts
    - Mention safety precautions where applicable
    - If the context doesn't contain enough information, say so clearly
    - Use clear, technical language that RV technicians would understand
    
    Format your response as a numbered list of steps.`;

    const userMessage = `Question: ${question}

Context from RV repair manuals:
${context.map((chunk, index) => `${index + 1}. ${chunk}`).join('\n\n')}

Please provide step-by-step repair instructions based on this context.`;

    return this.generateChatCompletion([
      { role: 'user', content: userMessage }
    ], systemPrompt);
  }

  /**
   * Get the current model configuration
   * @returns Object with model information
   */
  getModelInfo() {
    return {
      chatModel: this.model,
      embeddingModel: this.embeddingModel,
    };
  }
}

// Export singleton instance
export const openaiClient = new OpenAIClient();
export default openaiClient;