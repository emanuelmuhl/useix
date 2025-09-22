import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTeacherDto, UpdateTeacherDto, ImportTeachersDto, TeacherFilterDto } from './dto/teacher.dto';

@ApiTags('Teachers')
@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @ApiOperation({ summary: 'Create new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.create(createTeacherDto);
  }

  @ApiOperation({ summary: 'Get all teachers with filters' })
  @ApiResponse({ status: 200, description: 'List of teachers' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() filters: TeacherFilterDto) {
    return this.teacherService.findAll(filters);
  }

  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher details' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.teacherService.findOne(id);
  }

  @ApiOperation({ summary: 'Update teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTeacherDto: UpdateTeacherDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @ApiOperation({ summary: 'Delete teacher' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teacherService.remove(id);
  }

  @ApiOperation({ summary: 'Import teachers from CSV' })
  @ApiResponse({ status: 201, description: 'Teachers imported successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('import')
  async importTeachers(@Body() importData: ImportTeachersDto) {
    return this.teacherService.importTeachers(importData.tenantId, importData.teachers);
  }

  @ApiOperation({ summary: 'Export teachers to CSV/Excel' })
  @ApiResponse({ status: 200, description: 'Teachers exported successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('export/:tenantId')
  async exportTeachers(
    @Param('tenantId') tenantId: string,
    @Query('format') format: 'csv' | 'xlsx' = 'csv'
  ) {
    return this.teacherService.exportTeachers(tenantId, format);
  }

  @ApiOperation({ summary: 'Get teacher statistics by tenant' })
  @ApiResponse({ status: 200, description: 'Teacher statistics' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats/:tenantId')
  async getStats(@Param('tenantId') tenantId: string) {
    return this.teacherService.getStatsByTenant(tenantId);
  }

  @ApiOperation({ summary: 'Health check for teacher service' })
  @Get('health/check')
  healthCheck() {
    return { 
      status: 'ok', 
      service: 'teacher',
      timestamp: new Date().toISOString()
    };
  }
}