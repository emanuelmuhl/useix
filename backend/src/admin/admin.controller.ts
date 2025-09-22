import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin Console')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get system overview/dashboard' })
  @ApiResponse({ status: 200, description: 'System dashboard data' })
  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @ApiOperation({ summary: 'Create new tenant (school)' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  @Post('tenants')
  createTenant(@Body() createTenantDto: any) {
    return this.adminService.createTenant(createTenantDto);
  }

  @ApiOperation({ summary: 'Get all tenants with statistics' })
  @ApiResponse({ status: 200, description: 'List of tenants with stats' })
  @Get('tenants')
  getAllTenants() {
    return this.adminService.getAllTenants();
  }

  @ApiOperation({ summary: 'Get tenant details with full statistics' })
  @ApiResponse({ status: 200, description: 'Tenant details and statistics' })
  @Get('tenants/:id')
  getTenantDetails(@Param('id') id: string) {
    return this.adminService.getTenantDetails(id);
  }

  @ApiOperation({ summary: 'Activate/Deactivate tenant' })
  @ApiResponse({ status: 200, description: 'Tenant status updated' })
  @Patch('tenants/:id/status')
  updateTenantStatus(@Param('id') id: string, @Body() statusDto: { isActive: boolean }) {
    return this.adminService.updateTenantStatus(id, statusDto.isActive);
  }

  @ApiOperation({ summary: 'Reset tenant admin password' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @Post('tenants/:id/reset-password')
  resetTenantAdminPassword(@Param('id') tenantId: string, @Body() resetDto: { adminEmail: string }) {
    return this.adminService.resetTenantAdminPassword(tenantId, resetDto.adminEmail);
  }

  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'System-wide statistics' })
  @Get('stats')
  getSystemStats() {
    return this.adminService.getSystemStats();
  }

  @ApiOperation({ summary: 'Health check for admin service' })
  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'admin', timestamp: new Date().toISOString() };
  }
}
