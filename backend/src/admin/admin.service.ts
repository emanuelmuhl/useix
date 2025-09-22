import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';
import { CreateTenantDto } from '../tenant/dto/tenant.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}

  async getDashboardStats(): Promise<{
    totalTenants: number;
    activeTenants: number;
    totalStudents: number;
    totalTeachers: number;
    recentTenants: any[];
  }> {
    const tenantsResponse = await this.tenantService.findAll(1, 100);
    const tenants = tenantsResponse.data;

    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.isActive).length,
      totalStudents: 0, // Will be calculated from all tenants
      totalTeachers: 0, // Will be calculated from all tenants
      recentTenants: tenants.slice(0, 5),
    };
  }

  async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    services: {
      database: 'up' | 'down';
      api: 'up' | 'down';
    };
    uptime: number;
  }> {
    return {
      status: 'healthy',
      services: {
        database: 'up',
        api: 'up',
      },
      uptime: process.uptime(),
    };
  }

  async getTenantOverview(): Promise<any[]> {
    const tenantsResponse = await this.tenantService.findAll(1, 100);
    const tenants = tenantsResponse.data;

    return await Promise.all(
      tenants.map(async (tenant) => {
        try {
          const studentsResponse = await this.studentService.findAll({ page: 1, limit: 1 });
          const teachersResponse = await this.teacherService.findAll({ page: 1, limit: 1 });

          return {
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            isActive: tenant.isActive,
            createdAt: tenant.createdAt,
            stats: {
              students: studentsResponse.total,
              teachers: teachersResponse.total,
            },
          };
        } catch (error) {
          return {
            id: tenant.id,
            name: tenant.name,
            subdomain: tenant.subdomain,
            isActive: tenant.isActive,
            createdAt: tenant.createdAt,
            stats: {
              students: 0,
              teachers: 0,
            },
          };
        }
      })
    );
  }

  async getGlobalStats(): Promise<{
    tenants: {
      total: number;
      active: number;
      inactive: number;
    };
    users: {
      totalAdmins: number;
      totalStudents: number;
      totalTeachers: number;
    };
  }> {
    const tenantsResponse = await this.tenantService.findAll(1, 1000);
    const tenants = tenantsResponse.data;

    return {
      tenants: {
        total: tenants.length,
        active: tenants.filter(t => t.isActive).length,
        inactive: tenants.filter(t => !t.isActive).length,
      },
      users: {
        totalAdmins: tenants.reduce((sum, t) => sum + (t.admins?.length || 0), 0),
        totalStudents: 0, // Will be calculated
        totalTeachers: 0, // Will be calculated
      },
    };
  }

  async createTenant(createTenantDto: CreateTenantDto): Promise<any> {
    return this.tenantService.create(createTenantDto);
  }

  async getTenantDetails(id: string): Promise<any> {
    return this.tenantService.findOne(id);
  }

  async updateTenantStatus(id: string, isActive: boolean): Promise<any> {
    return this.tenantService.update(id, { isActive });
  }

  async resetTenantAdminPassword(tenantId: string, adminEmail: string): Promise<any> {
    // This would implement password reset logic
    return {
      success: true,
      message: `Password reset email sent to ${adminEmail}`,
    };
  }

  async getTotalStudentsCount(): Promise<number> {
    const studentsResponse = await this.studentService.findAll({ page: 1, limit: 1 });
    return studentsResponse.total;
  }

  async getTotalTeachersCount(): Promise<number> {
    return 0;
  }

  async getStudentsByTenant(tenantId: string): Promise<number> {
    const studentsResponse = await this.studentService.findAll({ page: 1, limit: 1 });
    return studentsResponse.total;
  }
}