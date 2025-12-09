import { ApiProperty } from '@nestjs/swagger';

class WorkflowFilesDto {
  @ApiProperty()
  siteHtml: string;

  @ApiProperty()
  sitePdf: string;

  @ApiProperty()
  qrImage: string;

  @ApiProperty()
  letterPdf: string;
}

export class WorkflowResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  workflowId: string;

  @ApiProperty({ enum: ['pending', 'processing', 'completed', 'failed'] })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty()
  progress: number;

  @ApiProperty({ type: WorkflowFilesDto, required: false })
  files?: WorkflowFilesDto;

  @ApiProperty({ required: false })
  error?: string;
}
