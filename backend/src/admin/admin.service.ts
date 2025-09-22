import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';
import { StudentService } from '../student/student.service';
import { TeacherService } from '../teacher/teacher.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly tenantService: TenantService,
    private readonly studentService: StudentService,
    private readonly teacherService: TeacherService,
  ) {}

  async getDashboard() {
    const tenants = await this.tenantService.findAll();
    const totalStudents = await this.getTotalStudentsCount();
    const totalTeachers = await this.getTotalTeachersCount();

    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.isActive).length,
      totalStudents,
      totalTeachers,
      recentTenants: tenants.slice(0, 5),
      systemHealth: 'healthy',
      lastUpdated: new Date().toISOString(),
    };
  }

  async createTenant(createTenantDto: any) {
    // Erstelle Mandant
    const tenant = await this.tenantService.create(createTenantDto);

    // TODO: Erstelle separate Datenbank für Mandant
    // TODO: Erstelle Admin-Benutzer für Mandant

    return {
      tenant,
      message: 'Tenant created successfully',
      databaseCreated: false, // TODO: Implementierung
      adminCreated: false,    // TODO: Implementierung
    };
  }

  async getAllTenants() {
    const tenants = await this.tenantService.findAll();
    
    // Füge Statistiken für jeden Mandanten hinzu
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant) => {
        const studentCount = await this.getStudentCountForTenant(tenant.id);
        const teacherCount = await this.getTeacherCountForTenant(tenant.id);
        
        return {
          ...tenant,
          stats: {
            students: studentCount,
            teachers: teacherCount,
            admins: tenant.admins?.length || 0,
          },
        };
      })
    );

    return tenantsWithStats;
  }

  async getTenantDetails(tenantId: string) {
    const tenant = await this.tenantService.findOne(tenantId);
    const students = await this.studentService.findAll(tenantId);
    const teachers = await this.teacherService.findAll(tenantId);

    return {
      tenant,
      statistics: {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalAdmins: tenant.admins?.length || 0,
        activeStudents: students.filter(s => s.email).length,
      },
      recentActivity: {
        lastStudentAdded: students[0]?.createdAt || null,
        lastTeacherAdded: teachers[0]?.createdAt || null,
      },
    };
  }

  async updateTenantStatus(tenantId: string, isActive: boolean) {
    return this.tenantService.update(tenantId, { isActive });
  }

  async resetTenantAdminPassword(tenantId: string, adminEmail: string) {
    // TODO: Implementiere Passwort-Reset
    return {
      message: 'Password reset functionality will be implemented',
      tenantId,
      adminEmail,
      newPassword: 'temp_password_123', // Temporär
    };
  }

  async getSystemStats() {
    const tenants = await this.tenantService.findAll();
    const totalStudents = await this.getTotalStudentsCount();
    const totalTeachers = await this.getTotalTeachersCount();

    return {
      tenants: {
        total: tenants.length,
        active: tenants.filter(t => t.isActive).length,
        inactive: tenants.filter(t => !t.isActive).length,
      },
      users: {
        totalStudents,
        totalTeachers,
        totalAdmins: tenants.reduce((sum, t) => sum + (t.admins?.length || 0), 0),
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      },
    };
  }

  private async getTotalStudentsCount(): Promise<number> {
    const students = await this.studentService.findAll();
    return students.length;
  }

  private async getTotalTeachersCount(): Promise<number> {
    const teachers = await this.teacherService.findAll();
    return teachers.length;
  }

  private async getStudentCountForTenant(tenantId: string): Promise<number> {
    const students = await this.studentService.findAll(tenantId);
    return students.length;
  }

  private async getTeacherCountForTenant(tenantId: string): Promise<number> {
    const teachers = await this.teacherService.findAll(tenantId);
    return teachers.length;
  }
}
