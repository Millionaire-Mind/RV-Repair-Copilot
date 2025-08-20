import { logger } from './logger';

/**
 * Text chunking configuration
 */
export interface ChunkingConfig {
  maxChunkSize: number;
  minChunkSize: number;
  overlapSize: number;
  preserveParagraphs: boolean;
  preserveSentences: boolean;
}

/**
 * Default chunking configuration
 */
const DEFAULT_CONFIG: ChunkingConfig = {
  maxChunkSize: 1000,    // Maximum characters per chunk
  minChunkSize: 200,     // Minimum characters per chunk
  overlapSize: 100,      // Overlap between chunks
  preserveParagraphs: true,
  preserveSentences: true,
};

/**
 * Split text into chunks for vector embeddings
 * @param text - The text to chunk
 * @param config - Optional chunking configuration
 * @returns string[] - Array of text chunks
 */
export function chunkText(text: string, config: Partial<ChunkingConfig> = {}): string[] {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    logger.debug(`Chunking text with config:`, finalConfig);

    if (!text || text.trim().length === 0) {
      logger.warn('Empty text provided for chunking');
      return [];
    }

    // Clean the text first
    const cleanedText = cleanText(text);
    
    if (cleanedText.length <= finalConfig.maxChunkSize) {
      logger.debug('Text is smaller than max chunk size, returning as single chunk');
      return [cleanedText];
    }

    const chunks: string[] = [];
    let currentPosition = 0;

    while (currentPosition < cleanedText.length) {
      let chunkEnd = currentPosition + finalConfig.maxChunkSize;
      
      // If this is not the last chunk, try to find a good break point
      if (chunkEnd < cleanedText.length) {
        chunkEnd = findOptimalBreakPoint(
          cleanedText,
          currentPosition,
          chunkEnd,
          finalConfig
        );
      }

      const chunk = cleanedText.slice(currentPosition, chunkEnd).trim();
      
      if (chunk.length >= finalConfig.minChunkSize) {
        chunks.push(chunk);
        logger.debug(`Created chunk ${chunks.length}: ${chunk.length} characters`);
      }

      // Move to next position with overlap
      currentPosition = chunkEnd - finalConfig.overlapSize;
      
      // Ensure we don't go backwards
      if (currentPosition <= chunks.length > 0 ? chunks.length - 1 : 0) {
        currentPosition = chunkEnd;
      }
    }

    logger.info(`Successfully chunked text into ${chunks.length} chunks`);
    return chunks;
    
  } catch (error) {
    logger.error('Error chunking text:', error);
    throw new Error(`Failed to chunk text: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Find the optimal break point for a chunk
 * @param text - The full text
 * @param start - Start position of the chunk
 * @param maxEnd - Maximum end position
 * @param config - Chunking configuration
 * @returns number - Optimal end position
 */
function findOptimalBreakPoint(
  text: string,
  start: number,
  maxEnd: number,
  config: ChunkingConfig
): number {
  let end = maxEnd;
  
  // Try to break at paragraph boundaries first
  if (config.preserveParagraphs) {
    const paragraphBreak = findLastParagraphBreak(text, start, end);
    if (paragraphBreak > start + config.minChunkSize) {
      return paragraphBreak;
    }
  }
  
  // Try to break at sentence boundaries
  if (config.preserveSentences) {
    const sentenceBreak = findLastSentenceBreak(text, start, end);
    if (sentenceBreak > start + config.minChunkSize) {
      return sentenceBreak;
    }
  }
  
  // Try to break at word boundaries
  const wordBreak = findLastWordBreak(text, start, end);
  if (wordBreak > start + config.minChunkSize) {
    return wordBreak;
  }
  
  // If no good break point found, use the max end
  return end;
}

/**
 * Find the last paragraph break before the given position
 * @param text - The full text
 * @param start - Start position
 * @param end - End position
 * @returns number - Position of last paragraph break
 */
function findLastParagraphBreak(text: string, start: number, end: number): number {
  const searchText = text.slice(start, end);
  const lastDoubleNewline = searchText.lastIndexOf('\n\n');
  
  if (lastDoubleNewline !== -1) {
    return start + lastDoubleNewline + 2;
  }
  
  const lastSingleNewline = searchText.lastIndexOf('\n');
  if (lastSingleNewline !== -1) {
    return start + lastSingleNewline + 1;
  }
  
  return end;
}

/**
 * Find the last sentence break before the given position
 * @param text - The full text
 * @param start - Start position
 * @param end - End position
 * @returns number - Position of last sentence break
 */
function findLastSentenceBreak(text: string, start: number, end: number): number {
  const searchText = text.slice(start, end);
  
  // Look for sentence endings: . ! ? followed by space or newline
  const sentenceEndings = searchText.match(/[.!?]\s/g);
  if (sentenceEndings && sentenceEndings.length > 0) {
    const lastMatch = searchText.lastIndexOf(sentenceEndings[sentenceEndings.length - 1]);
    return start + lastMatch + 2; // +2 for the punctuation and space
  }
  
  return end;
}

/**
 * Find the last word break before the given position
 * @param text - The full text
 * @param start - Start position
 * @param end - End position
 * @returns number - Position of last word break
 */
function findLastWordBreak(text: string, start: number, end: number): number {
  const searchText = text.slice(start, end);
  const lastSpace = searchText.lastIndexOf(' ');
  
  if (lastSpace !== -1) {
    return start + lastSpace + 1;
  }
  
  return end;
}

/**
 * Clean text for chunking
 * @param text - Raw text
 * @returns string - Cleaned text
 */
function cleanText(text: string): string {
  return text
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive whitespace
    .replace(/[ \t]+/g, ' ')
    // Remove empty lines
    .replace(/\n\s*\n/g, '\n\n')
    // Trim
    .trim();
}

/**
 * Get chunking statistics
 * @param text - The original text
 * @param chunks - The generated chunks
 * @returns Object with chunking statistics
 */
export function getChunkingStats(text: string, chunks: string[]): any {
  const totalLength = text.length;
  const avgChunkLength = chunks.length > 0 ? totalLength / chunks.length : 0;
  const minChunkLength = chunks.length > 0 ? Math.min(...chunks.map(c => c.length)) : 0;
  const maxChunkLength = chunks.length > 0 ? Math.max(...chunks.map(c => c.length)) : 0;
  
  return {
    originalLength: totalLength,
    chunkCount: chunks.length,
    averageChunkLength: Math.round(avgChunkLength),
    minChunkLength,
    maxChunkLength,
    compressionRatio: chunks.length > 0 ? (totalLength / chunks.length) / totalLength : 0,
  };
}