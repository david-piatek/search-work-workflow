import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { QrService, QrData, QrBatchItem } from './qr.service';
import { createReadStream, existsSync } from 'fs';

@ApiTags('generators')
@Controller('generators/qr')
export class QrController {
  private readonly logger = new Logger(QrController.name);

  constructor(private readonly qrService: QrService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a QR code' })
  @ApiResponse({ status: 201, description: 'QR code generated successfully' })
  async generateQr(@Body() qrData: QrData) {
    return this.qrService.generateQr(qrData);
  }

  @Post('batch')
  @ApiOperation({ summary: 'Generate multiple QR codes' })
  @ApiResponse({ status: 201, description: 'QR codes generated successfully' })
  async generateBatch(@Body() body: { items: QrBatchItem[] }) {
    return this.qrService.generateBatch(body.items);
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Download a generated QR code' })
  async downloadQr(@Res() res: Response, @Param('filename') filename: string) {
    const filePath = this.qrService.getFilePath(filename);

    if (!existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'File not found',
      });
    }

    const fileStream = createReadStream(filePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    fileStream.pipe(res);
  }
}
