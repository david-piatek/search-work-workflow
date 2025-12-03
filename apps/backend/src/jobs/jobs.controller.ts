import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all scraped jobs' })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Returns list of jobs' })
  async findAll(@Query('source') source?: string, @Query('limit') limit?: number) {
    return this.jobsService.findAll(source, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get job statistics' })
  @ApiResponse({ status: 200, description: 'Returns job statistics' })
  async getStats() {
    return this.jobsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific job' })
  @ApiResponse({ status: 200, description: 'Returns the job' })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }
}
