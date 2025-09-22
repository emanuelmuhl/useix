import { IsString, IsEmail, IsOptional, IsEnum, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'First name', example: 'Max' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Mustermann' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'max.mustermann@schule.de' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Office 365 password', example: 'TempPass123', required: false })
  @IsOptional()
  @IsString()
  office365Password?: string;

  @ApiProperty({ description: 'iPad code (4-6 digits)', example: '1234' })
  @IsString()
  ipadCode: string;

  @ApiProperty({ description: 'Class name', example: 'PR1' })
  @IsString()
  className: string;

  @ApiProperty({ description: 'Class addition', example: 'A', enum: ['A', 'B', 'C'], required: false })
  @IsOptional()
  @IsEnum(['A', 'B', 'C'])
  classAddition?: 'A' | 'B' | 'C';

  @ApiProperty({ description: 'Teacher ID', required: false })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  tenantId: string;
}

export class UpdateStudentDto {
  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Office 365 password', required: false })
  @IsOptional()
  @IsString()
  office365Password?: string;

  @ApiProperty({ description: 'iPad code', required: false })
  @IsOptional()
  @IsString()
  ipadCode?: string;

  @ApiProperty({ description: 'Class name', required: false })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiProperty({ description: 'Class addition', enum: ['A', 'B', 'C'], required: false })
  @IsOptional()
  @IsEnum(['A', 'B', 'C'])
  classAddition?: 'A' | 'B' | 'C';

  @ApiProperty({ description: 'Teacher ID', required: false })
  @IsOptional()
  @IsString()
  teacherId?: string;
}

export class ImportStudentsDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: 'Array of students to import' })
  @IsArray()
  students: CreateStudentDto[];
}

export class StudentFilterDto {
  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by class', required: false })
  @IsOptional()
  @IsString()
  className?: string;

  @ApiProperty({ description: 'Filter by teacher', required: false })
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ description: 'Filter by tenant', required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  limit?: number;
}