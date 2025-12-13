import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { JobOffersService } from './job-offers.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOffer } from './entities/job-offer.entity';

@Controller('job-offers')
export class JobOffersController {
  constructor(private readonly jobOffersService: JobOffersService) {}

  @Post()
  async create(@Body() createJobOfferDto: CreateJobOfferDto): Promise<JobOffer> {
    return await this.jobOffersService.create(createJobOfferDto);
  }

  @Get()
  async findAll(): Promise<JobOffer[]> {
    return await this.jobOffersService.findAll();
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<JobOffer> {
    return await this.jobOffersService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobOffer> {
    return await this.jobOffersService.findOne(id);
  }

  @Patch('by-slug/:slug')
  async updateBySlug(
    @Param('slug') slug: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOffer> {
    return await this.jobOffersService.updateBySlug(slug, updateJobOfferDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobOfferDto: UpdateJobOfferDto,
  ): Promise<JobOffer> {
    return await this.jobOffersService.update(id, updateJobOfferDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.jobOffersService.remove(id);
  }
}
