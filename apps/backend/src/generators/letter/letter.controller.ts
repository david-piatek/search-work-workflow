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
import { LetterService, LetterData } from './letter.service';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';

@ApiTags('generators')
@Controller('generators/letter')
export class LetterController {
  private readonly logger = new Logger(LetterController.name);

  constructor(private readonly letterService: LetterService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a letter PDF' })
  @ApiResponse({ status: 201, description: 'Letter generated successfully' })
  async generateLetter(@Body() letterData: LetterData) {
    const filename = await this.letterService.generateLetter(letterData);

    return {
      success: true,
      filename,
      downloadUrl: `/api/generators/letter/download/${filename}`,
    };
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Download a generated letter' })
  async downloadLetter(
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    const filePath = join(
      process.cwd(),
      '..',
      'letter-generator',
      'output',
      filename,
    );

    if (!existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: 'File not found',
      });
    }

    const fileStream = createReadStream(filePath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    fileStream.pipe(res);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get list of available templates' })
  getTemplates() {
    return {
      success: true,
      templates: this.letterService.getTemplates(),
    };
  }
}
