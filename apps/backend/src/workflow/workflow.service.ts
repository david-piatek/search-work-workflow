import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { basename } from 'path';
import { WorkflowEntity } from './entities/workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { WorkflowResponseDto } from './dto/workflow-response.dto';
import { SiteService } from '../generators/site/site.service';
import { QrService } from '../generators/qr/qr.service';
import { LetterService } from '../generators/letter/letter.service';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(
    @InjectRepository(WorkflowEntity)
    private workflowRepo: Repository<WorkflowEntity>,
    private siteService: SiteService,
    private qrService: QrService,
    private letterService: LetterService,
  ) {}

  async createWorkflow(dto: CreateWorkflowDto): Promise<WorkflowResponseDto> {
    this.logger.log('Creating new workflow...');

    // Create workflow record
    const workflow = this.workflowRepo.create({
      status: 'pending',
      progress: 0,
      currentStep: 'initializing',
      inputData: dto,
    });
    await this.workflowRepo.save(workflow);

    this.logger.log(`Workflow created with ID: ${workflow.id}`);

    // Process in background
    this.processWorkflow(workflow.id, dto).catch((error) => {
      this.logger.error(`Workflow ${workflow.id} failed:`, error);
      this.markAsFailed(workflow.id, error.message);
    });

    return {
      success: true,
      workflowId: workflow.id,
      status: 'processing',
      progress: 0,
    };
  }

  async processWorkflow(workflowId: string, dto: CreateWorkflowDto) {
    this.logger.log(`Processing workflow ${workflowId}...`);

    try {
      // Step 1: Generate site HTML (20%)
      await this.updateProgress(workflowId, 'generating_site_html', 20);
      const siteHtmlPath = await this.siteService.generateHTMLFile({
        template: dto.siteContent.template,
        data: this.transformSiteData(dto.siteContent),
      });
      this.logger.log(`Site HTML generated: ${siteHtmlPath}`);

      // Step 2: Generate site PDF (40%)
      await this.updateProgress(workflowId, 'generating_site_pdf', 40);
      const sitePdfFilename = await this.siteService.generateSite({
        template: dto.siteContent.template,
        data: this.transformSiteData(dto.siteContent),
      });
      this.logger.log(`Site PDF generated: ${sitePdfFilename}`);

      // Step 3: Generate site URL (50%)
      await this.updateProgress(workflowId, 'creating_site_url', 50);
      const siteFilename = basename(siteHtmlPath, '.html');
      const siteUrl = `/hosted-sites/${siteFilename}`;
      this.logger.log(`Site URL: ${siteUrl}`);

      // Step 4: Generate QR code (70%)
      await this.updateProgress(workflowId, 'generating_qr', 70);
      const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
      const qrResult = await this.qrService.generateQr({
        data: `${baseUrl}${siteUrl}`,
        style: dto.options?.qrStyle || 'elegant',
        width: 200,
      });
      this.logger.log(`QR code generated: ${qrResult.filename}`);

      // Step 5: Generate letter with QR (90%)
      await this.updateProgress(workflowId, 'generating_letter', 90);
      const letterFilename = await this.letterService.generateLetterWithQr({
        template: dto.letterContent.template,
        data: this.buildLetterData(dto),
        qrDataUrl: qrResult.dataUrl,
      });
      this.logger.log(`Letter generated: ${letterFilename}`);

      // Step 6: Save result (100%)
      await this.updateProgress(workflowId, 'completed', 100);
      await this.workflowRepo.update(workflowId, {
        status: 'completed',
        result: {
          siteHtmlPath,
          sitePdfPath: sitePdfFilename,
          qrImagePath: qrResult.filename,
          letterPdfPath: letterFilename,
          siteUrl,
        },
      });

      this.logger.log(`Workflow ${workflowId} completed successfully`);
    } catch (error) {
      this.logger.error(`Error processing workflow ${workflowId}:`, error);
      await this.markAsFailed(workflowId, error.message);
      throw error;
    }
  }

  async getStatus(workflowId: string): Promise<WorkflowResponseDto> {
    const workflow = await this.workflowRepo.findOne({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new NotFoundException('Workflow not found');
    }

    const response: WorkflowResponseDto = {
      success: workflow.status !== 'failed',
      workflowId: workflow.id,
      status: workflow.status,
      progress: workflow.progress,
    };

    if (workflow.status === 'completed' && workflow.result) {
      response.files = {
        siteHtml: workflow.result.siteUrl,
        sitePdf: `/api/generators/site/download/${basename(workflow.result.sitePdfPath)}`,
        qrImage: `/api/generators/qr/download/${basename(workflow.result.qrImagePath)}`,
        letterPdf: `/api/generators/letter/download/${basename(workflow.result.letterPdfPath)}`,
      };
    }

    if (workflow.error) {
      response.error = workflow.error;
    }

    return response;
  }

  private transformSiteData(siteContent: CreateWorkflowDto['siteContent']): Record<string, any> {
    return {
      'main-title': siteContent.title,
      'company-name': siteContent.title,
      subtitle: siteContent.subtitle,
      about: siteContent.about,
      'matching-points': siteContent.matchingPoints,
      'workflow-steps': [],
      stats: siteContent.stats,
      'footer-links': [],
    };
  }

  private buildLetterData(dto: CreateWorkflowDto): Record<string, any> {
    return {
      'sender-name': dto.personalInfo.name,
      'sender-email': dto.personalInfo.email,
      'sender-phone': dto.personalInfo.phone || '',
      'company-name': dto.companyInfo.name,
      position: dto.companyInfo.position,
      Date: new Date().toLocaleDateString('fr-FR'),
      'intro-paragraph': dto.letterContent.introduction,
      'matching-description': dto.letterContent.motivation,
      'closing-paragraph': dto.letterContent.closing,
      'contact-info': `${dto.personalInfo.email}${dto.personalInfo.phone ? ' | ' + dto.personalInfo.phone : ''}`,
    };
  }

  private async updateProgress(workflowId: string, step: string, progress: number) {
    await this.workflowRepo.update(workflowId, {
      status: 'processing',
      currentStep: step,
      progress,
    });
  }

  private async markAsFailed(workflowId: string, error: string) {
    await this.workflowRepo.update(workflowId, {
      status: 'failed',
      error,
    });
  }
}
