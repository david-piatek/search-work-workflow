import { IsString, IsUrl, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScraperDto {
  @ApiProperty({ example: 'freework' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://www.freework.com/jobs' })
  @IsUrl()
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
