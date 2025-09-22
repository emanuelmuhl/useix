import { IsString, IsEmail, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto {
  @ApiProperty({ description: 'First name', example: 'Michael' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Bauer' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Email address', example: 'm.bauer@schule.de', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Department', example: 'Mathematik', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Subjects taught', example: ['Mathematik', 'Physik'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  tenantId: string;
}

export class UpdateTeacherDto {
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

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Department', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Subjects taught', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjects?: string[];

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class TeacherFilterDto {
  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Filter by tenant', required: false })
  @IsOptional()
  @IsString()
  tenantId?: string;

  @ApiProperty({ description: 'Filter by department', required: false })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ description: 'Filter by active status', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  limit?: number;
}

export class ImportTeachersDto {
  @ApiProperty({ description: 'Tenant ID' })
  @IsString()
  tenantId: string;

  @ApiProperty({ description: 'Array of teachers to import' })
  @IsArray()
  teachers: CreateTeacherDto[];
}
