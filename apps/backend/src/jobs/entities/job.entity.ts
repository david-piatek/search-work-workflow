import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('jobs')
export class JobEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  postedDate: string;

  @Column({ nullable: true })
  salary: string;

  @Column({ nullable: true })
  type: string;

  @Column()
  @Index()
  scrapedFrom: string;

  @Column({ type: 'timestamp' })
  scrapedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}
