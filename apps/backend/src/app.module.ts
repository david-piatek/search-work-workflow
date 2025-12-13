import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratorsModule } from './generators/generators.module';
import { HostingModule } from './hosting/hosting.module';
import { JobOffersModule } from './job-offers/job-offers.module';

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
    GeneratorsModule,
    HostingModule,
    JobOffersModule,
  ],
})
export class AppModule {}
