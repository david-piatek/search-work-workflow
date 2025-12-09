import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { WorkflowEntity } from './entities/workflow.entity';
import { GeneratorsModule } from '../generators/generators.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkflowEntity]),
    GeneratorsModule,
  ],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService],
})
export class WorkflowModule {}
