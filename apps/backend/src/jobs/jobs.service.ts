import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './entities/job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(JobEntity)
    private jobRepository: Repository<JobEntity>,
  ) {}

  async findAll(source?: string, limit = 100): Promise<JobEntity[]> {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .orderBy('job.scrapedAt', 'DESC')
      .take(limit);

    if (source) {
      query.where('job.scrapedFrom = :source', { source });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<JobEntity> {
    const job = await this.jobRepository.findOne({ where: { id } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    return job;
  }

  async getStats() {
    const total = await this.jobRepository.count();
    const bySource = await this.jobRepository
      .createQueryBuilder('job')
      .select('job.scrapedFrom', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('job.scrapedFrom')
      .getRawMany();

    const recent = await this.jobRepository
      .createQueryBuilder('job')
      .select('DATE(job.scrapedAt)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('job.scrapedAt > NOW() - INTERVAL \'7 days\'')
      .groupBy('DATE(job.scrapedAt)')
      .getRawMany();

    return {
      total,
      bySource,
      recentActivity: recent,
    };
  }
}
