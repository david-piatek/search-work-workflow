import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JobOffer } from './entities/company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<JobOffer> {
    return await this.companiesService.create(createCompanyDto);
  }

  @Post('upsert')
  async upsert(@Body() createCompanyDto: CreateCompanyDto): Promise<JobOffer> {
    return await this.companiesService.upsert(createCompanyDto);
  }

  @Get()
  async findAll(): Promise<JobOffer[]> {
    return await this.companiesService.findAll();
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<JobOffer> {
    return await this.companiesService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<JobOffer> {
    return await this.companiesService.findOne(id);
  }

  @Patch('by-slug/:slug')
  async updateBySlug(
    @Param('slug') slug: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<JobOffer> {
    return await this.companiesService.updateBySlug(slug, updateCompanyDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<JobOffer> {
    return await this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.companiesService.remove(id);
  }
}
