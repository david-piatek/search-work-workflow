import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ScraperEntity } from './entities/scraper.entity';
import { CreateScraperDto } from './dto/create-scraper.dto';
import { ExecuteScraperDto } from './dto/execute-scraper.dto';
import { ScraperGeneratorService } from './scraper-generator.service';

@Injectable()
export class ScrapersService {
  constructor(
    @InjectRepository(ScraperEntity)
    private scraperRepository: Repository<ScraperEntity>,
    private scraperGeneratorService: ScraperGeneratorService,
    @InjectQueue('scraping') private scrapingQueue: Queue,
  ) {}

  async findAll(): Promise<ScraperEntity[]> {
    return this.scraperRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByName(name: string): Promise<ScraperEntity> {
    const scraper = await this.scraperRepository.findOne({ where: { name } });
    if (!scraper) {
      throw new NotFoundException(`Scraper "${name}" not found`);
    }
    return scraper;
  }

  async createOrGet(createScraperDto: CreateScraperDto): Promise<ScraperEntity> {
    const existing = await this.scraperRepository.findOne({
      where: { name: createScraperDto.name },
    });

    if (existing) {
      return existing;
    }

    // Generate scraper code
    const code = await this.scraperGeneratorService.generateScraperCode(
      createScraperDto.name,
      createScraperDto.url,
      createScraperDto.config,
    );

    const scraper = this.scraperRepository.create({
      ...createScraperDto,
      code,
    });

    return this.scraperRepository.save(scraper);
  }

  async executeScraper(executeScraperDto: ExecuteScraperDto) {
    const scraper = await this.findByName(executeScraperDto.scraperName);

    // Add job to queue
    const job = await this.scrapingQueue.add('scrape', {
      scraperId: scraper.id,
      scraperName: scraper.name,
      params: executeScraperDto.params,
    });

    // Update execution stats
    await this.scraperRepository.update(scraper.id, {
      lastExecutedAt: new Date(),
      executionCount: scraper.executionCount + 1,
    });

    return {
      message: 'Scraping job started',
      jobId: job.id,
      scraper: scraper.name,
    };
  }

  async remove(name: string): Promise<void> {
    const scraper = await this.findByName(name);
    await this.scraperRepository.remove(scraper);
  }
}
