import { IsString, IsEmail, IsOptional, IsBoolean, IsObject, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ description: 'School name', example: 'Beispiel Grundschule' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Subdomain for tenant', example: 'beispielschule' })
  @IsString()
  subdomain: string;

  @ApiProperty({ description: 'Maximum number of students', example: 500 })
  @IsOptional()
  @IsNumber()
  maxStudents?: number;

  @ApiProperty({ description: 'Maximum number of teachers', example: 50 })
  @IsOptional()
  @IsNumber()
  maxTeachers?: number;

  @ApiProperty({ description: 'Features enabled for this tenant' })
  @IsOptional()
  features?: string[];
}

export class UpdateTenantDto {
  @ApiProperty({ description: 'School name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Tenant active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Tenant settings' })
  @IsOptional()
  @IsObject()
  settings?: {
    maxStudents: number;
    maxTeachers: number;
    features: string[];
  };
}

export class CreateTenantAdminDto {
  @ApiProperty({ description: 'Admin email', example: 'admin@beispielschule.de' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'First name', example: 'Max' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Mustermann' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Password', example: 'securePassword123' })
  @IsString()
  password: string;
}
