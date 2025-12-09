import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { WorkflowResponseDto } from './dto/workflow-response.dto';

@Controller('workflow')
@ApiTags('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('application')
  @ApiOperation({ summary: 'Create a complete job application workflow' })
  @ApiResponse({ status: 201, description: 'Workflow created successfully', type: WorkflowResponseDto })
  async createWorkflow(@Body() dto: CreateWorkflowDto): Promise<WorkflowResponseDto> {
    return this.workflowService.createWorkflow(dto);
  }

  @Get('application/:id/status')
  @ApiOperation({ summary: 'Get workflow status and results' })
  @ApiResponse({ status: 200, description: 'Workflow status retrieved', type: WorkflowResponseDto })
  async getStatus(@Param('id') id: string): Promise<WorkflowResponseDto> {
    return this.workflowService.getStatus(id);
  }
}
