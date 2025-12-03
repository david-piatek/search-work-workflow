import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScrapersService } from './scrapers.service';
import { CreateScraperDto } from './dto/create-scraper.dto';
import { ExecuteScraperDto } from './dto/execute-scraper.dto';

@ApiTags('scrapers')
@Controller('scrapers')
export class ScrapersController {
  constructor(private readonly scrapersService: ScrapersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available scrapers' })
  @ApiResponse({ status: 200, description: 'Returns list of scrapers' })
  async findAll() {
    return this.scrapersService.findAll();
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a specific scraper by name' })
  @ApiResponse({ status: 200, description: 'Returns the scraper' })
  @ApiResponse({ status: 404, description: 'Scraper not found' })
  async findOne(@Param('name') name: string) {
    return this.scrapersService.findByName(name);
  }

  @Post()
  @ApiOperation({ summary: 'Create or get existing scraper' })
  @ApiResponse({ status: 201, description: 'Scraper created or retrieved' })
  async createOrGet(@Body() createScraperDto: CreateScraperDto) {
    return this.scrapersService.createOrGet(createScraperDto);
  }

  @Post('execute')
  @ApiOperation({ summary: 'Execute a scraper' })
  @ApiResponse({ status: 200, description: 'Scraper execution started' })
  async execute(@Body() executeScraperDto: ExecuteScraperDto) {
    return this.scrapersService.executeScraper(executeScraperDto);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete a scraper' })
  @ApiResponse({ status: 200, description: 'Scraper deleted' })
  async remove(@Param('name') name: string) {
    return this.scrapersService.remove(name);
  }
}
