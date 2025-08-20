import { logger } from './logger';

/**
 * Scraping configuration
 */
export interface ScrapingConfig {
  userAgent: string;
  timeout: number;
  maxRetries: number;
  delayBetweenRequests: number;
  maxContentLength: number;
}

/**
 * Default scraping configuration
 */
const DEFAULT_SCRAPING_CONFIG: ScrapingConfig = {
  userAgent: 'RV-Repair-Copilot/1.0 (+https://github.com/rv-repair-copilot)',
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  delayBetweenRequests: 1000, // 1 second
  maxContentLength: 1024 * 1024, // 1MB
};

/**
 * Scraped content structure
 */
export interface ScrapedContent {
  url: string;
  title: string;
  content: string;
  metadata: {
    brand?: string;
    component?: string;
    lastModified?: string;
    contentType: string;
    size: number;
  };
  timestamp: string;
}

/**
 * Web scraping service for trusted RV OEM and component sites
 */
class WebScraper {
  private config: ScrapingConfig;
  private trustedDomains: Set<string>;

  constructor(config: Partial<ScrapingConfig> = {}) {
    this.config = { ...DEFAULT_SCRAPING_CONFIG, ...config };
    this.trustedDomains = new Set([
      // RV Manufacturers
      'winnebago.com',
      'airstream.com',
      'jayco.com',
      'forestriver.com',
      'thorindustries.com',
      'keystonerv.com',
      'granddesignrv.com',
      'palomino.com',
      'coachmen.com',
      
      // Component Manufacturers
      'dometic.com',
      'norcold.com',
      'atwoodmobile.com',
      'suburban.com',
      'thetford.com',
      'sealand.com',
      'valterra.com',
      'camco.com',
      'blue-ox.com',
      'reese.com',
      'curtmfg.com',
      
      // RV Parts & Service
      'rvpartscountry.com',
      'etrailer.com',
      'campingworld.com',
      'rvupgradestore.com',
      'rvwholesalers.com',
      'rvautoparts.com',
    ]);

    logger.info(`Web scraper initialized with ${this.trustedDomains.size} trusted domains`);
  }

  /**
   * Check if a URL is from a trusted domain
   * @param url - URL to check
   * @returns boolean - Whether the domain is trusted
   */
  isTrustedDomain(url: string): boolean {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      return this.trustedDomains.has(domain);
    } catch (error) {
      logger.warn(`Invalid URL provided for domain check: ${url}`);
      return false;
    }
  }

  /**
   * Add a trusted domain
   * @param domain - Domain to add
   */
  addTrustedDomain(domain: string): void {
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '');
    this.trustedDomains.add(cleanDomain);
    logger.info(`Added trusted domain: ${cleanDomain}`);
  }

  /**
   * Remove a trusted domain
   * @param domain - Domain to remove
   */
  removeTrustedDomain(domain: string): void {
    const cleanDomain = domain.toLowerCase().replace(/^https?:\/\//, '');
    if (this.trustedDomains.delete(cleanDomain)) {
      logger.info(`Removed trusted domain: ${cleanDomain}`);
    }
  }

  /**
   * Get list of trusted domains
   * @returns string[] - Array of trusted domains
   */
  getTrustedDomains(): string[] {
    return Array.from(this.trustedDomains);
  }

  /**
   * Scrape content from a trusted URL
   * @param url - URL to scrape
   * @returns Promise<ScrapedContent> - Scraped content
   */
  async scrapeURL(url: string): Promise<ScrapedContent> {
    try {
      if (!this.isTrustedDomain(url)) {
        throw new Error(`URL is not from a trusted domain: ${url}`);
      }

      logger.info(`Scraping trusted URL: ${url}`);

      // Note: In a production environment, you would implement actual HTTP requests here
      // For now, we'll return a mock response to demonstrate the structure
      
      const mockContent = await this.mockScrape(url);
      
      logger.info(`Successfully scraped content from: ${url}`, {
        contentLength: mockContent.content.length,
        title: mockContent.title,
      });

      return mockContent;

    } catch (error) {
      logger.error(`Error scraping URL ${url}:`, error);
      throw new Error(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Mock scraping function (replace with actual HTTP implementation)
   * @param url - URL to mock scrape
   * @returns Promise<ScrapedContent> - Mock scraped content
   */
  private async mockScrape(url: string): Promise<ScrapedContent> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const domain = new URL(url).hostname;
    const path = new URL(url).pathname;

    // Generate mock content based on URL
    const mockTitle = `RV Repair Information - ${domain}`;
    const mockContent = `This is mock content scraped from ${url}. 
    
    In a real implementation, this would contain actual HTML content extracted from the webpage, 
    including repair manuals, troubleshooting guides, and technical specifications.
    
    The content would be cleaned and processed to extract relevant RV repair information.
    
    Path: ${path}
    Domain: ${domain}
    Timestamp: ${new Date().toISOString()}`;

    return {
      url,
      title: mockTitle,
      content: mockContent,
      metadata: {
        brand: this.extractBrandFromDomain(domain),
        component: this.extractComponentFromPath(path),
        lastModified: new Date().toISOString(),
        contentType: 'text/html',
        size: mockContent.length,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Extract brand information from domain
   * @param domain - Domain name
   * @returns string | undefined - Extracted brand
   */
  private extractBrandFromDomain(domain: string): string | undefined {
    const brandMap: Record<string, string> = {
      'winnebago.com': 'Winnebago',
      'airstream.com': 'Airstream',
      'jayco.com': 'Jayco',
      'forestriver.com': 'Forest River',
      'thorindustries.com': 'Thor Industries',
      'keystonerv.com': 'Keystone RV',
      'granddesignrv.com': 'Grand Design RV',
      'palomino.com': 'Palomino',
      'coachmen.com': 'Coachmen',
      'dometic.com': 'Dometic',
      'norcold.com': 'Norcold',
      'atwoodmobile.com': 'Atwood Mobile',
      'suburban.com': 'Suburban',
      'thetford.com': 'Thetford',
      'sealand.com': 'SeaLand',
      'valterra.com': 'Valterra',
      'camco.com': 'Camco',
      'blue-ox.com': 'Blue Ox',
      'reese.com': 'Reese',
      'curtmfg.com': 'Curt Manufacturing',
    };

    return brandMap[domain] || undefined;
  }

  /**
   * Extract component information from URL path
   * @param path - URL path
   * @returns string | undefined - Extracted component
   */
  private extractComponentFromPath(path: string): string | undefined {
    const componentKeywords = [
      'furnace', 'water-heater', 'refrigerator', 'air-conditioner', 'generator',
      'battery', 'inverter', 'converter', 'brakes', 'suspension', 'electrical',
      'plumbing', 'propane', 'awning', 'slide-out', 'leveling', 'tire',
    ];

    const pathLower = path.toLowerCase();
    for (const keyword of componentKeywords) {
      if (pathLower.includes(keyword)) {
        return keyword.replace('-', ' ');
      }
    }

    return undefined;
  }

  /**
   * Batch scrape multiple URLs
   * @param urls - Array of URLs to scrape
   * @returns Promise<ScrapedContent[]> - Array of scraped content
   */
  async batchScrape(urls: string[]): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = [];
    
    for (let i = 0; i < urls.length; i++) {
      try {
        const url = urls[i];
        logger.debug(`Processing URL ${i + 1}/${urls.length}: ${url}`);
        
        const content = await this.scrapeURL(url);
        results.push(content);
        
        // Add delay between requests to be respectful
        if (i < urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.config.delayBetweenRequests));
        }
        
      } catch (error) {
        logger.error(`Failed to scrape URL ${urls[i]}:`, error);
        // Continue with other URLs
      }
    }
    
    logger.info(`Batch scraping completed: ${results.length}/${urls.length} successful`);
    return results;
  }

  /**
   * Get scraping statistics
   * @returns Object with scraping statistics
   */
  getStats(): any {
    return {
      trustedDomains: this.trustedDomains.size,
      configuration: this.config,
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const webScraper = new WebScraper();
export default webScraper;