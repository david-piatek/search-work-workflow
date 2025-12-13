import { IsString, IsNotEmpty, Matches, IsUrl, IsOptional, IsBoolean } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  slug: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsOptional()
  @IsBoolean()
  rerunWorkflow?: boolean;
}
