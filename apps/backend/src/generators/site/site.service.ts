import { Injectable, Logger } from '@nestjs/common';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import puppeteer from 'puppeteer';

export interface SiteData {
  template: 'elegant' | 'synthwave';
  data: Record<string, any>;
}

interface WorkflowStep {
  title: string;
  description: string;
}

interface MatchingPoint {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
}

interface FooterLink {
  url: string;
  text: string;
}

@Injectable()
export class SiteService {
  private readonly logger = new Logger(SiteService.name);
  private readonly templatesPath = join(process.cwd(), '..', 'static-site', 'templates');
  private readonly outputPath = join(process.cwd(), '..', 'static-site', 'output');

  constructor() {
    // Ensure output directory exists
    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath, { recursive: true });
    }
  }

  /**
   * Generate a site as HTML file
   */
  async generateHTMLFile(siteData: SiteData): Promise<string> {
    this.logger.log('Generating HTML file...');

    try {
      // Load template
      const templateFile = this.getTemplateFile(siteData.template);
      const template = readFileSync(templateFile, 'utf-8');

      // Hydrate template
      const hydratedContent = this.hydrateTemplate(template, siteData.data);

      // Save HTML file
      const outputFilename = `site-${Date.now()}.html`;
      const outputFilePath = join(this.outputPath, outputFilename);

      writeFileSync(outputFilePath, hydratedContent, 'utf-8');

      // Also copy to hosted-sites directory
      const hostedSitesPath = join(process.cwd(), '..', 'hosted-sites');
      if (!existsSync(hostedSitesPath)) {
        mkdirSync(hostedSitesPath, { recursive: true });
      }
      const hostedFilePath = join(hostedSitesPath, outputFilename);
      writeFileSync(hostedFilePath, hydratedContent, 'utf-8');

      this.logger.log(`HTML file generated: ${outputFilename}`);
      return outputFilePath;
    } catch (error) {
      this.logger.error(`Failed to generate HTML file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a site as PDF
   */
  async generateSite(siteData: SiteData): Promise<string> {
    this.logger.log('Generating site PDF...');

    try {
      // Load template
      const templateFile = this.getTemplateFile(siteData.template);
      const template = readFileSync(templateFile, 'utf-8');

      // Hydrate template
      const hydratedContent = this.hydrateTemplate(template, siteData.data);

      // Generate PDF
      const outputFilename = `site-${Date.now()}.pdf`;
      const outputFilePath = join(this.outputPath, outputFilename);

      await this.generatePDF(hydratedContent, outputFilePath);

      this.logger.log(`Site PDF generated: ${outputFilename}`);
      return outputFilename;
    } catch (error) {
      this.logger.error(`Failed to generate site: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get template file path
   */
  private getTemplateFile(template: string): string {
    const templates = {
      elegant: 'presentation.html',
      synthwave: 'synthwave.html',
    };

    const filename = templates[template] || templates.elegant;
    return join(this.templatesPath, filename);
  }

  /**
   * Hydrate template with data
   */
  private hydrateTemplate(template: string, data: Record<string, any>): string {
    let result = template;

    // Generate complex sections
    const workflowStepsHTML = this.generateWorkflowSteps(data['workflow-steps'] || []);
    const matchingPointsHTML = this.generateMatchingPoints(data['matching-points'] || []);
    const statsHTML = this.generateStatsSection(data['stats'] || []);
    const footerLinksHTML = this.generateFooterLinks(data['footer-links'] || []);

    // Replace complex sections first
    result = result.replace('{{workflow-steps}}', workflowStepsHTML);
    result = result.replace('{{matching-points}}', matchingPointsHTML);
    result = result.replace('{{stats-section}}', statsHTML);
    result = result.replace('{{footer-links}}', footerLinksHTML);

    // Replace simple variables
    for (const [key, value] of Object.entries(data)) {
      if (!['workflow-steps', 'matching-points', 'stats', 'footer-links'].includes(key)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, String(value || ''));
      }
    }

    return result;
  }

  /**
   * Generate PDF with Puppeteer
   */
  private async generatePDF(htmlContent: string, outputPath: string): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
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

      // Wait for images and fonts to load
      await page.evaluate(() => {
        return Promise.all([
          ...Array.from(document.images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 5000);
            });
          }),
          // Wait for fonts
          document.fonts.ready,
        ]);
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
   * Generate workflow steps HTML
   */
  private generateWorkflowSteps(steps: WorkflowStep[]): string {
    return steps
      .map(
        (step, index) => `
    <div class="workflow-step">
      <div class="workflow-step-number">${index + 1}</div>
      <div class="workflow-step-title">${step.title}</div>
      <div class="workflow-step-desc">${step.description}</div>
    </div>
  `,
      )
      .join('\n');
  }

  /**
   * Generate matching points HTML
   */
  private generateMatchingPoints(points: MatchingPoint[]): string {
    return points
      .map(
        (point) => `
    <div class="matching-card">
      <div class="matching-icon">${point.icon}</div>
      <h3 class="matching-title">${point.title}</h3>
      <p class="matching-description">${point.description}</p>
    </div>
  `,
      )
      .join('\n');
  }

  /**
   * Generate stats section HTML
   */
  private generateStatsSection(stats: Stat[]): string {
    if (!stats || stats.length === 0) return '';

    const statsHTML = stats
      .map(
        (stat) => `
    <div class="stat-card">
      <div class="stat-number">${stat.number}</div>
      <div class="stat-label">${stat.label}</div>
    </div>
  `,
      )
      .join('\n');

    return `
    <section class="section">
      <h2 class="section-title">
        <span class="section-icon">📊</span>
        En Chiffres
      </h2>
      <div class="stats-grid">
        ${statsHTML}
      </div>
    </section>
  `;
  }

  /**
   * Generate footer links HTML
   */
  private generateFooterLinks(links: FooterLink[]): string {
    return links
      .map(
        (link) => `
    <a href="${link.url}" target="_blank" class="footer-link">${link.text}</a>
  `,
      )
      .join('\n');
  }

  /**
   * Get list of available templates
   */
  getTemplates(): string[] {
    return ['elegant', 'synthwave'];
  }

  /**
   * Get output file path for download
   */
  getFilePath(filename: string): string {
    return join(this.outputPath, filename);
  }
}
