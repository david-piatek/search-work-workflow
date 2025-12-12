import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { HostingService } from './hosting.service';

@Controller('hosted-sites')
@ApiTags('hosted-sites')
export class HostingController {
  constructor(private readonly hostingService: HostingService) {}

  @Get(':siteName')
  @ApiOperation({ summary: 'Serve a hosted static site' })
  @ApiParam({ name: 'siteName', description: 'Site filename without extension' })
  async serveSite(@Param('siteName') siteName: string, @Res() res: Response): Promise<void> {
    const sitePath = this.hostingService.getSitePath(siteName);

    if (!existsSync(sitePath)) {
      throw new NotFoundException('Site not found');
    }

    res.sendFile(sitePath);
  }
}
