import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScraperEntity } from './entities/scraper.entity';
import { ScraperExecutorService } from './scraper-executor.service';

@Processor('scraping')
export class ScraperProcessor {
  constructor(
    @InjectRepository(ScraperEntity)
    private scraperRepository: Repository<ScraperEntity>,
    private scraperExecutorService: ScraperExecutorService,
  ) {}

  @Process('scrape')
  async handleScrape(job: Job) {
    const { scraperId, scraperName, params } = job.data;

    console.log(`Starting scrape job for ${scraperName}`);
    job.progress(10);

    const scraper = await this.scraperRepository.findOne({ where: { id: scraperId } });
    if (!scraper) {
      throw new Error(`Scraper ${scraperName} not found`);
    }

    job.progress(30);

    const result = await this.scraperExecutorService.executeScraperCode(
      scraperName,
      scraper.code,
      params,
    );

    job.progress(90);

    console.log(`Scrape job completed for ${scraperName}:`, result.success ? 'success' : 'failed');

    job.progress(100);

    return result;
  }
}
