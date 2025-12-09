import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobEntity } from '../../jobs/entities/job.entity';
import { CreateWorkflowDto } from '../dto/create-workflow.dto';

@Entity('workflows')
export class WorkflowEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({ type: 'int', default: 0 })
  progress: number;

  @Column({ default: 'initializing' })
  currentStep: string;

  @Column({ type: 'jsonb' })
  inputData: CreateWorkflowDto;

  @Column({ type: 'jsonb', nullable: true })
  result: {
    siteHtmlPath: string;
    sitePdfPath: string;
    qrImagePath: string;
    letterPdfPath: string;
    siteUrl: string;
  };

  @Column({ type: 'text', nullable: true })
  error: string;

  @ManyToOne(() => JobEntity, { nullable: true })
  @JoinColumn({ name: 'relatedJobId' })
  relatedJob: JobEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
