import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScrapersModule } from './scrapers/scrapers.module';
import { JobsModule } from './jobs/jobs.module';
import { GeneratorsModule } from './generators/generators.module';
import { WorkflowModule } from './workflow/workflow.module';
import { HostingModule } from './hosting/hosting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://admin:admin123@localhost:5432/jobscraper',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    ScrapersModule,
    JobsModule,
    GeneratorsModule,
    WorkflowModule,
    HostingModule,
  ],
})
export class AppModule {}
