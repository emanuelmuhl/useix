import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantAdmin } from './entities/tenant-admin.entity';
import { CreateTenantDto, UpdateTenantDto, CreateTenantAdminDto } from './dto/tenant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantAdmin)
    private tenantAdminRepository: Repository<TenantAdmin>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Check if subdomain already exists
    const existingTenant = await this.tenantRepository.findOne({
      where: { subdomain: createTenantDto.subdomain }
    });

    if (existingTenant) {
      throw new ConflictException('Subdomain already exists');
    }

    const tenant = this.tenantRepository.create({
      name: createTenantDto.name,
      subdomain: createTenantDto.subdomain,
      databaseName: `userix_tenant_${createTenantDto.subdomain}`,
      settings: {
        maxStudents: createTenantDto.maxStudents || 1000,
        maxTeachers: createTenantDto.maxTeachers || 100,
        features: createTenantDto.features || ['students', 'teachers', 'classes', 'reports'],
      },
    });

    return await this.tenantRepository.save(tenant);
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{
    data: Tenant[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const [data, total] = await this.tenantRepository.findAndCount({
      relations: ['admins'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['admins'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async findBySubdomain(subdomain: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { subdomain },
      relations: ['admins'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
    }

    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    Object.assign(tenant, updateTenantDto);
    
    return await this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }

  async createTenantAdmin(tenantId: string, adminData: CreateTenantAdminDto): Promise<TenantAdmin> {
    // Check if email already exists
    const existingAdmin = await this.tenantAdminRepository.findOne({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(adminData.password, 10);

    const admin = this.tenantAdminRepository.create({
      tenantId,
      email: adminData.email,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      passwordHash,
    });

    return await this.tenantAdminRepository.save(admin);
  }

  async getStats(tenantId: string): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    activeUsers: number;
  }> {
    // TODO: Implement actual counting from related entities
    // For now, return mock data
    return {
      totalStudents: 245,
      totalTeachers: 18,
      totalClasses: 12,
      activeUsers: 198,
    };
  }

  async findAdminByEmail(email: string): Promise<TenantAdmin | null> {
    return await this.tenantAdminRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });
  }

  async validateAdminCredentials(email: string, password: string): Promise<TenantAdmin | null> {
    const admin = await this.findAdminByEmail(email);
    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return admin;
  }
}