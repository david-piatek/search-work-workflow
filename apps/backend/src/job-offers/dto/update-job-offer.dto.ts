import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateJobOfferDto {
  @IsString()
  @IsOptional()
  companyName?: string;

  @IsString()
  @IsOptional()
  jobTitle?: string;

  @IsString()
  @IsOptional()
  resumeJob?: string;

  @IsString()
  @IsOptional()
  cvPersonalizationHint?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  remotePolicy?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  cvMatchScore?: number;

  @IsString()
  @IsOptional()
  cvMatchScoreReason?: string;

  @IsString()
  @IsOptional()
  status?: string;
}
