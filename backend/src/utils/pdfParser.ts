import pdf from 'pdf-parse';
import fs from 'fs';
import { logger } from './logger';

/**
 * Parse a PDF file and extract text content
 * @param filePath - Path to the PDF file
 * @returns Promise<string> - Extracted text content
 */
export async function parsePDF(filePath: string): Promise<string> {
  try {
    logger.debug(`Parsing PDF file: ${filePath}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    // Read the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    
    // Parse the PDF
    const data = await pdf(dataBuffer, {
      // PDF parsing options
      max: 0, // No page limit
      version: 'v2.0.550',
    });

    const text = data.text;
    
    if (!text || text.trim().length === 0) {
      logger.warn(`No text content extracted from PDF: ${filePath}`);
      return '';
    }

    // Clean up the extracted text
    const cleanedText = cleanText(text);
    
    logger.debug(`Successfully parsed PDF: ${filePath}`, {
      pages: data.numpages,
      textLength: cleanedText.length,
      originalTextLength: text.length,
    });

    return cleanedText;
    
  } catch (error) {
    logger.error(`Error parsing PDF file ${filePath}:`, error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clean and normalize extracted text
 * @param text - Raw extracted text
 * @returns string - Cleaned text
 */
function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove page numbers and headers
    .replace(/Page \d+ of \d+/gi, '')
    .replace(/^\d+\s*$/gm, '')
    // Remove common PDF artifacts
    .replace(/[^\w\s\-.,;:!?()[\]{}"'`~@#$%^&*+=|\\/<>]/g, '')
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove empty lines
    .replace(/\n\s*\n/g, '\n')
    // Trim whitespace
    .trim();
}

/**
 * Extract metadata from PDF
 * @param filePath - Path to the PDF file
 * @returns Promise<any> - PDF metadata
 */
export async function extractPDFMetadata(filePath: string): Promise<any> {
  try {
    logger.debug(`Extracting metadata from PDF: ${filePath}`);
    
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer, {
      max: 0,
      version: 'v2.0.550',
    });

    const metadata = {
      pages: data.numpages,
      info: data.info || {},
      metadata: data.metadata || {},
      version: data.version,
      textLength: data.text.length,
    };

    logger.debug(`Extracted PDF metadata:`, metadata);
    return metadata;
    
  } catch (error) {
    logger.error(`Error extracting PDF metadata from ${filePath}:`, error);
    throw new Error(`Failed to extract PDF metadata: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate PDF file
 * @param filePath - Path to the PDF file
 * @returns Promise<boolean> - Whether the PDF is valid
 */
export async function validatePDF(filePath: string): Promise<boolean> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer, { max: 1 }); // Only parse first page for validation
    
    return data && data.text && data.text.length > 0;
    
  } catch (error) {
    logger.warn(`PDF validation failed for ${filePath}:`, error);
    return false;
  }
}