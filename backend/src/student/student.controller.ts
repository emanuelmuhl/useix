import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateStudentDto, UpdateStudentDto, ImportStudentsDto, StudentFilterDto } from './dto/student.dto';

@ApiTags('Students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiOperation({ summary: 'Create new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @ApiOperation({ summary: 'Get all students with filters' })
  @ApiResponse({ status: 200, description: 'List of students' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() filters: StudentFilterDto) {
    return this.studentService.findAll(filters);
  }

  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Student details' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @ApiOperation({ summary: 'Update student' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @ApiOperation({ summary: 'Delete student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @ApiOperation({ summary: 'Import students from CSV' })
  @ApiResponse({ status: 201, description: 'Students imported successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('import')
  async importStudents(@Body() importData: ImportStudentsDto) {
    return this.studentService.importStudents(importData);
  }

  @ApiOperation({ summary: 'Export students to CSV/Excel' })
  @ApiResponse({ status: 200, description: 'Students exported successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('export/:tenantId')
  async exportStudents(
    @Param('tenantId') tenantId: string,
    @Query('format') format: 'csv' | 'xlsx' = 'csv'
  ) {
    return this.studentService.exportStudents(tenantId, format);
  }

  @ApiOperation({ summary: 'Get student statistics by tenant' })
  @ApiResponse({ status: 200, description: 'Student statistics' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats/:tenantId')
  async getStats(@Param('tenantId') tenantId: string) {
    return this.studentService.getStatsByTenant(tenantId);
  }

  @ApiOperation({ summary: 'Health check for student service' })
  @Get('health/check')
  healthCheck() {
    return { 
      status: 'ok', 
      service: 'student',
      timestamp: new Date().toISOString()
    };
  }
}