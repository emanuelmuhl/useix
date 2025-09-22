import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTenantDto } from '../tenant/dto/tenant.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Create new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('tenants')
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.adminService.createTenant(createTenantDto);
  }

  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: 200, description: 'List of all tenants' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('tenants')
  async getAllTenants() {
    return this.adminService.getTenantOverview();
  }

  @ApiOperation({ summary: 'Get tenant details' })
  @ApiResponse({ status: 200, description: 'Tenant details retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('tenants/:id')
  async getTenantDetails(@Param('id') id: string) {
    return this.adminService.getTenantDetails(id);
  }

  @ApiOperation({ summary: 'Update tenant status' })
  @ApiResponse({ status: 200, description: 'Tenant status updated successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('tenants/:id/status')
  async updateTenantStatus(@Param('id') id: string, @Body() statusDto: { isActive: boolean }) {
    return this.adminService.updateTenantStatus(id, statusDto.isActive);
  }

  @ApiOperation({ summary: 'Reset tenant admin password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('tenants/:tenantId/reset-password')
  async resetTenantAdminPassword(@Param('tenantId') tenantId: string, @Body() resetDto: { adminEmail: string }) {
    return this.adminService.resetTenantAdminPassword(tenantId, resetDto.adminEmail);
  }

  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'System statistics retrieved successfully' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('stats')
  async getSystemStats() {
    return this.adminService.getGlobalStats();
  }

  @ApiOperation({ summary: 'Health check for admin service' })
  @Get('health')
  healthCheck() {
    return { 
      status: 'ok', 
      service: 'admin',
      timestamp: new Date().toISOString()
    };
  }
}