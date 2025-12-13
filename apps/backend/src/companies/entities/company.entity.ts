import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('job_offers')
export class JobOffer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  url: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ type: 'text', nullable: true })
  resumeJob: string;

  @Column({ type: 'text', nullable: true })
  cvPersonalizationHint: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  remotePolicy: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cvMatchScore: number;

  @Column({ type: 'text', nullable: true })
  cvMatchScoreReason: string;

  @Column({ default: 'new' })
  status: string;

  @Column({ default: false })
  rerunWorkflow: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
