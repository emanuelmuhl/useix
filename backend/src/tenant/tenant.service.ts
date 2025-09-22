import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantAdmin } from './entities/tenant-admin.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantAdmin)
    private tenantAdminRepository: Repository<TenantAdmin>,
  ) {}

  async create(createTenantDto: any): Promise<Tenant> {
    const tenant = this.tenantRepository.create({
      name: createTenantDto.name,
      subdomain: createTenantDto.subdomain,
      databaseName: `userix_tenant_${createTenantDto.subdomain}`,
      settings: {
        maxStudents: createTenantDto.maxStudents || 1000,
        maxTeachers: createTenantDto.maxTeachers || 100,
        features: createTenantDto.features || [],
      },
    });

    return this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({
      relations: ['admins'],
      order: { createdAt: 'DESC' },
    });
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

  async update(id: string, updateTenantDto: any): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    Object.assign(tenant, updateTenantDto);
    
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }

  async createTenantAdmin(tenantId: string, adminData: any): Promise<TenantAdmin> {
    const admin = this.tenantAdminRepository.create({
      tenantId,
      email: adminData.email,
      firstName: adminData.firstName,
      lastName: adminData.lastName,
      passwordHash: adminData.passwordHash,
    });

    return this.tenantAdminRepository.save(admin);
  }
}
