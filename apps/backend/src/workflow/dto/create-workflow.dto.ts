import { IsString, IsEmail, IsOptional, IsObject, IsArray, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PersonalInfoDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkedin?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  github?: string;
}

class CompanyInfoDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  jobId?: string;
}

class LetterContentDto {
  @ApiProperty({ enum: ['elegant', 'standard', 'christmas'] })
  @IsIn(['elegant', 'standard', 'christmas'])
  template: 'elegant' | 'standard' | 'christmas';

  @ApiProperty()
  @IsString()
  introduction: string;

  @ApiProperty()
  @IsString()
  motivation: string;

  @ApiProperty()
  @IsString()
  closing: string;
}

class MatchingPointDto {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;
}

class StatDto {
  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  label: string;
}

class SiteContentDto {
  @ApiProperty({ enum: ['elegant', 'synthwave'] })
  @IsIn(['elegant', 'synthwave'])
  template: 'elegant' | 'synthwave';

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  subtitle: string;

  @ApiProperty()
  @IsString()
  about: string;

  @ApiProperty({ type: [MatchingPointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchingPointDto)
  matchingPoints: MatchingPointDto[];

  @ApiProperty({ type: [StatDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatDto)
  stats: StatDto[];
}

class OptionsDto {
  @ApiProperty({ required: false, enum: ['standard', 'elegant'] })
  @IsOptional()
  @IsIn(['standard', 'elegant'])
  qrStyle?: 'standard' | 'elegant';
}

export class CreateWorkflowDto {
  @ApiProperty({ type: PersonalInfoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ApiProperty({ type: CompanyInfoDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CompanyInfoDto)
  companyInfo: CompanyInfoDto;

  @ApiProperty({ type: LetterContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => LetterContentDto)
  letterContent: LetterContentDto;

  @ApiProperty({ type: SiteContentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => SiteContentDto)
  siteContent: SiteContentDto;

  @ApiProperty({ type: OptionsDto, required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionsDto)
  options?: OptionsDto;
}
