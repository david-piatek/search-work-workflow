import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import * as QRCode from 'qrcode';

export interface QrData {
  data: string;
  style?: 'standard' | 'elegant';
  width?: number;
  color?: {
    dark: string;
    light: string;
  };
}

export interface QrBatchItem {
  data: string;
  filename: string;
}

@Injectable()
export class QrService {
  private readonly logger = new Logger(QrService.name);
  private readonly outputPath = join(process.cwd(), '..', 'qr-generator', 'output');

  constructor() {
    // Ensure output directory exists
    if (!existsSync(this.outputPath)) {
      mkdirSync(this.outputPath, { recursive: true });
    }
  }

  /**
   * Generate QR code and return data URL
   */
  async generateQr(qrData: QrData): Promise<{
    success: boolean;
    filename: string;
    dataUrl: string;
    downloadUrl: string;
  }> {
    this.logger.log('Generating QR code...');

    const options = this.getQrOptions(qrData);
    const filename = `qr-${Date.now()}.png`;
    const filePath = join(this.outputPath, filename);

    try {
      // Generate QR code file
      await QRCode.toFile(filePath, qrData.data, options);

      // Also generate data URL for preview
      const dataUrl = await QRCode.toDataURL(qrData.data, options);

      this.logger.log(`QR code generated: ${filename}`);

      return {
        success: true,
        filename,
        dataUrl,
        downloadUrl: `/api/generators/qr/download/${filename}`,
      };
    } catch (error) {
      this.logger.error(`Failed to generate QR code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate multiple QR codes
   */
  async generateBatch(items: QrBatchItem[]): Promise<{
    success: boolean;
    results: Array<{
      filename: string;
      dataUrl: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    this.logger.log(`Generating ${items.length} QR codes...`);

    const results = [];

    for (const item of items) {
      try {
        const options = this.getQrOptions({ data: item.data });
        const filename = item.filename || `qr-${Date.now()}.png`;
        const filePath = join(this.outputPath, filename);

        await QRCode.toFile(filePath, item.data, options);
        const dataUrl = await QRCode.toDataURL(item.data, options);

        results.push({
          filename,
          dataUrl,
          success: true,
        });
      } catch (error) {
        results.push({
          filename: item.filename || 'error',
          dataUrl: '',
          success: false,
          error: error.message,
        });
      }
    }

    return {
      success: true,
      results,
    };
  }

  /**
   * Get QR code generation options based on style
   */
  private getQrOptions(qrData: QrData) {
    const baseOptions = {
      errorCorrectionLevel: 'H' as const,
      margin: 1,
      width: qrData.width || 300,
    };

    if (qrData.style === 'elegant') {
      return {
        ...baseOptions,
        width: qrData.width || 200,
        margin: 2,
        color: {
          dark: '#2c3e50',
          light: '#fdfbf7',
        },
      };
    }

    return {
      ...baseOptions,
      color: qrData.color || {
        dark: '#000000',
        light: '#FFFFFF',
      },
    };
  }

  /**
   * Get output file path for download
   */
  getFilePath(filename: string): string {
    return join(this.outputPath, filename);
  }
}
