import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

export interface LetterData {
  template: string; // 'elegant' | 'christmas' | 'custom'
  data: Record<string, any>;
  includeQr?: boolean;
  qrUrl?: string;
}

@Injectable()
export class LetterService {
  private readonly logger = new Logger(LetterService.name);
  private readonly templatesPath = join(process.cwd(), '..', 'letter-generator', 'templates');
  private readonly outputPath = join(process.cwd(), '..', 'letter-generator', 'output');

  /**
   * Generate a letter with embedded QR code
   */
  async generateLetterWithQr(params: {
    template: string;
    data: Record<string, any>;
    qrDataUrl: string;
  }): Promise<string> {
    this.logger.log('Generating letter with QR code...');

    // Add QR code to data
    const dataWithQr = {
      ...params.data,
      'qr-code': `<img src="${params.qrDataUrl}" width="150" height="150" alt="QR Code" style="display: block; margin: 1rem 0;" />`,
    };

    // Generate letter with QR embedded
    return this.generateLetter({
      template: params.template,
      data: dataWithQr,
    });
  }

  /**
   * Generate a letter PDF
   */
  async generateLetter(letterData: LetterData): Promise<string> {
    this.logger.log('Generating letter...');

    // Ensure output directory exists
    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath, { recursive: true });
    }

    // Load template
    const templateFile = this.getTemplateFile(letterData.template);
    const template = readFileSync(templateFile, 'utf-8');

    // Hydrate template
    const hydratedContent = this.hydrateTemplate(template, letterData.data);

    // Generate PDF
    const outputFilename = `letter-${Date.now()}.pdf`;
    const outputFilePath = join(this.outputPath, outputFilename);

    await this.generatePDF(hydratedContent, outputFilePath);

    this.logger.log(`Letter generated: ${outputFilename}`);
    return outputFilename;
  }

  /**
   * Get template file path
   */
  private getTemplateFile(template: string): string {
    const templates = {
      elegant: 'letter-christmas-elegant.html',
      christmas: 'letter-christmas-elegant.html',
      standard: 'letter-template.html',
    };

    const filename = templates[template] || templates.standard;
    return join(this.templatesPath, filename);
  }

  /**
   * Hydrate template with data
   */
  private hydrateTemplate(template: string, data: Record<string, any>): string {
    let result = template;

    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value || '');
    }

    return result;
  }

  /**
   * Generate PDF with Puppeteer
   */
  private async generatePDF(htmlContent: string, outputPath: string): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      const page = await browser.newPage();

      await page.setRequestInterception(true);
      page.on('request', (request) => {
        request.continue().catch(() => {});
      });

      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
      });

      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 5000);
            });
          }),
        );
      });

      await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        preferCSSPageSize: true,
      });
    } finally {
      await browser.close();
    }
  }

  /**
   * Get list of available templates
   */
  getTemplates(): string[] {
    return ['standard', 'elegant', 'christmas'];
  }
}
