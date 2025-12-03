import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ScraperExecutorService {
  private dataDir = process.env.DATA_DIR || './data';

  async executeScraperCode(
    scraperName: string,
    code: string,
    params?: Record<string, any>,
  ): Promise<any> {
    try {
      // Create a temporary file with the scraper code
      const tempFile = path.join('/tmp', `scraper-${scraperName}-${Date.now()}.js`);
      await fs.writeFile(tempFile, code);

      // Execute the scraper
      const scraperModule = require(tempFile);
      const result = await scraperModule.scrape(params);

      // Save results to file system
      if (result.success && result.jobs && result.jobs.length > 0) {
        await this.saveResults(scraperName, result);
      }

      // Clean up temp file
      await fs.unlink(tempFile);

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack,
      };
    }
  }

  private async saveResults(scraperName: string, result: any): Promise<void> {
    // Ensure data directory exists
    await fs.mkdir(this.dataDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${scraperName}-${timestamp}.json`;
    const filepath = path.join(this.dataDir, filename);

    await fs.writeFile(filepath, JSON.stringify(result, null, 2));

    // Also save to a "latest" file
    const latestPath = path.join(this.dataDir, `${scraperName}-latest.json`);
    await fs.writeFile(latestPath, JSON.stringify(result, null, 2));
  }

  async getScraperResults(scraperName: string): Promise<any[]> {
    try {
      const files = await fs.readdir(this.dataDir);
      const scraperFiles = files.filter((f) => f.startsWith(`${scraperName}-`) && f.endsWith('.json'));

      const results = await Promise.all(
        scraperFiles.map(async (file) => {
          const content = await fs.readFile(path.join(this.dataDir, file), 'utf-8');
          return JSON.parse(content);
        }),
      );

      return results;
    } catch (error) {
      return [];
    }
  }

  async getLatestResults(scraperName: string): Promise<any | null> {
    try {
      const latestPath = path.join(this.dataDir, `${scraperName}-latest.json`);
      const content = await fs.readFile(latestPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }
}
