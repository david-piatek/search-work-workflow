import { Controller, Post, Body, Get, Param, Res, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { SiteService, SiteData } from './site.service';
import { existsSync, createReadStream } from 'fs';

@ApiTags('generators')
@Controller('generators/site')
export class SiteController {
  private readonly logger = new Logger(SiteController.name);

  constructor(private readonly siteService: SiteService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a site as PDF' })
  @ApiResponse({ status: 201, description: 'Site PDF generated successfully' })
  async generateSite(@Body() siteData: SiteData) {
    const filename = await this.siteService.generateSite(siteData);

    return {
      success: true,
      filename,
      downloadUrl: `/api/generators/site/download/${filename}`,
    };
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get list of available site templates' })
  getTemplates() {
    return {
      success: true,
      templates: this.siteService.getTemplates(),
    };
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Download a generated site PDF' })
  async downloadSite(@Res() res: Response, @Param('filename') filename: string) {
    const filePath = this.siteService.getFilePath(filename);

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
}
