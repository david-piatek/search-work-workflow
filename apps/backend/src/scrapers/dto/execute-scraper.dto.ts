import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExecuteScraperDto {
  @ApiProperty({ example: 'freework' })
  @IsString()
  scraperName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  params?: Record<string, any>;
}
