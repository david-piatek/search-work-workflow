import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScrapersController } from './scrapers.controller';
import { ScrapersService } from './scrapers.service';
import { ScraperEntity } from './entities/scraper.entity';
import { ScraperGeneratorService } from './scraper-generator.service';
import { ScraperExecutorService } from './scraper-executor.service';
import { ScraperProcessor } from './scraper.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([ScraperEntity]),
    BullModule.registerQueue({
      name: 'scraping',
    }),
  ],
  controllers: [ScrapersController],
  providers: [
    ScrapersService,
    ScraperGeneratorService,
    ScraperExecutorService,
    ScraperProcessor,
  ],
  exports: [ScrapersService, ScraperExecutorService],
})
export class ScrapersModule {}
