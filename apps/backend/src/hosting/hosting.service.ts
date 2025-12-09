import { Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

@Injectable()
export class HostingService {
  private readonly logger = new Logger(HostingService.name);
  private readonly sitesPath = join(process.cwd(), '..', 'hosted-sites');

  constructor() {
    if (!existsSync(this.sitesPath)) {
      mkdirSync(this.sitesPath, { recursive: true });
      this.logger.log(`Created hosted-sites directory: ${this.sitesPath}`);
    }
  }

  getSitePath(siteName: string): string {
    return join(this.sitesPath, `${siteName}.html`);
  }
}
