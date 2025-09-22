import { Controller, Post, Body, UseGuards, Get, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login for all users (admin and tenant admins)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Admin Login (deprecated - use /login)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @Post('admin/login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return this.login(loginDto);
  }

  @ApiOperation({ summary: 'Tenant Admin Login (deprecated - use /login)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @Post('tenant/login')
  async tenantLogin(@Body() loginDto: LoginDto) {
    return this.login(loginDto);
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      success: true,
      data: req.user,
    };
  }

  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout() {
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @ApiOperation({ summary: 'Health check for auth service' })
  @Get('health')
  healthCheck() {
    return { 
      status: 'ok', 
      service: 'auth',
      timestamp: new Date().toISOString()
    };
  }
}