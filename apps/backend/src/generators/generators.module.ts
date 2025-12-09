import { Module } from '@nestjs/common';
import { LetterGeneratorModule } from './letter/letter.module';
import { QrGeneratorModule } from './qr/qr.module';
import { SiteGeneratorModule } from './site/site.module';

@Module({
  imports: [
    LetterGeneratorModule,
    QrGeneratorModule,
    SiteGeneratorModule,
  ],
  exports: [
    LetterGeneratorModule,
    QrGeneratorModule,
    SiteGeneratorModule,
  ],
})
export class GeneratorsModule {}
