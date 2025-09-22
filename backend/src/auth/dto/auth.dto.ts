import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    description: 'Email address',
    example: 'admin@userix.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Password',
    example: 'admin123'
  })
  @IsString()
  @MinLength(6)
  password: string;
}
