import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Create new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @Post()
  create(@Body() createStudentDto: any) {
    return this.studentService.create(createStudentDto);
  }

  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({ status: 200, description: 'List of students' })
  @Get()
  findAll(@Query('tenantId') tenantId?: string) {
    return this.studentService.findAll(tenantId);
  }

  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student details' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: any) {
    return this.studentService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @ApiOperation({ summary: 'Import students from CSV' })
  @ApiResponse({ status: 200, description: 'Students imported successfully' })
  @Post('import')
  importStudents(@Body() importData: any) {
    return this.studentService.importStudents(importData);
  }

  @ApiOperation({ summary: 'Export students to Excel' })
  @ApiResponse({ status: 200, description: 'Students exported successfully' })
  @Get('export/excel')
  exportToExcel(@Query('tenantId') tenantId: string) {
    return this.studentService.exportToExcel(tenantId);
  }
}
