import { Module } from '@nestjs/common';
import { QrGeneratorModule } from './qr/qr.module';

@Module({
  imports: [QrGeneratorModule],
  exports: [QrGeneratorModule],
})
export class GeneratorsModule {}
