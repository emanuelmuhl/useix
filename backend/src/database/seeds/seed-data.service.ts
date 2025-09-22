import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../tenant/entities/tenant.entity';
import { TenantAdmin } from '../../tenant/entities/tenant-admin.entity';
import { Student } from '../../student/entities/student.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Class } from '../../student/entities/class.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedDataService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
    @InjectRepository(TenantAdmin)
    private tenantAdminRepository: Repository<TenantAdmin>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await this.clearData();

    // Seed in order
    const tenants = await this.seedTenants();
    const admins = await this.seedTenantAdmins(tenants);
    const teachers = await this.seedTeachers(tenants);
    const classes = await this.seedClasses(tenants, teachers);
    const students = await this.seedStudents(tenants, teachers, classes);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - ${tenants.length} Tenants`);
    console.log(`   - ${admins.length} Tenant Admins`);
    console.log(`   - ${teachers.length} Teachers`);
    console.log(`   - ${classes.length} Classes`);
    console.log(`   - ${students.length} Students`);
  }

  private async clearData(): Promise<void> {
    console.log('🧹 Clearing existing data...');
    await this.studentRepository.delete({});
    await this.classRepository.delete({});
    await this.teacherRepository.delete({});
    await this.tenantAdminRepository.delete({});
    await this.tenantRepository.delete({});
  }

  private async seedTenants(): Promise<Tenant[]> {
    console.log('🏢 Seeding tenants...');
    
    const tenantData = [
      {
        name: 'Beispiel Grundschule',
        subdomain: 'beispielschule',
        databaseName: 'userix_tenant_beispielschule',
        settings: {
          maxStudents: 500,
          maxTeachers: 30,
          features: ['students', 'teachers', 'classes', 'reports', 'import_export'],
        },
      },
      {
        name: 'Max-Mustermann-Realschule',
        subdomain: 'mustermann-rs',
        databaseName: 'userix_tenant_mustermann_rs',
        settings: {
          maxStudents: 800,
          maxTeachers: 45,
          features: ['students', 'teachers', 'classes', 'reports', 'import_export', 'advanced_analytics'],
        },
      },
      {
        name: 'Gymnasium am Park',
        subdomain: 'gym-park',
        databaseName: 'userix_tenant_gym_park',
        settings: {
          maxStudents: 1200,
          maxTeachers: 65,
          features: ['students', 'teachers', 'classes', 'reports', 'import_export', 'advanced_analytics', 'parent_portal'],
        },
      },
    ];

    const tenants = [];
    for (const data of tenantData) {
      const tenant = this.tenantRepository.create(data);
      const saved = await this.tenantRepository.save(tenant);
      tenants.push(saved);
    }

    return tenants;
  }

  private async seedTenantAdmins(tenants: Tenant[]): Promise<TenantAdmin[]> {
    console.log('👨‍💼 Seeding tenant admins...');
    
    const adminData = [
      {
        tenantId: tenants[0].id,
        email: 'admin@beispielschule.de',
        firstName: 'Anna',
        lastName: 'Schmidt',
        password: 'schule123',
      },
      {
        tenantId: tenants[1].id,
        email: 'direktor@mustermann-rs.de',
        firstName: 'Thomas',
        lastName: 'Weber',
        password: 'realschule456',
      },
      {
        tenantId: tenants[2].id,
        email: 'verwaltung@gym-park.de',
        firstName: 'Maria',
        lastName: 'Müller',
        password: 'gymnasium789',
      },
    ];

    const admins = [];
    for (const data of adminData) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      const admin = this.tenantAdminRepository.create({
        ...data,
        passwordHash,
      });
      delete (admin as any).password;
      const saved = await this.tenantAdminRepository.save(admin);
      admins.push(saved);
    }

    return admins;
  }

  private async seedTeachers(tenants: Tenant[]): Promise<Teacher[]> {
    console.log('👨‍🏫 Seeding teachers...');
    
    const teacherNames = [
      { firstName: 'Michael', lastName: 'Bauer', email: 'm.bauer@schule.de' },
      { firstName: 'Sarah', lastName: 'Fischer', email: 's.fischer@schule.de' },
      { firstName: 'David', lastName: 'Wagner', email: 'd.wagner@schule.de' },
      { firstName: 'Lisa', lastName: 'Hoffmann', email: 'l.hoffmann@schule.de' },
      { firstName: 'Peter', lastName: 'Schulz', email: 'p.schulz@schule.de' },
      { firstName: 'Julia', lastName: 'Zimmermann', email: 'j.zimmermann@schule.de' },
      { firstName: 'Andreas', lastName: 'Koch', email: 'a.koch@schule.de' },
      { firstName: 'Nina', lastName: 'Richter', email: 'n.richter@schule.de' },
      { firstName: 'Stefan', lastName: 'Klein', email: 's.klein@schule.de' },
      { firstName: 'Claudia', lastName: 'Wolf', email: 'c.wolf@schule.de' },
    ];

    const teachers = [];
    for (const tenant of tenants) {
      const teachersPerTenant = Math.floor(Math.random() * 5) + 8; // 8-12 teachers per tenant
      
      for (let i = 0; i < teachersPerTenant; i++) {
        const teacherData = teacherNames[i % teacherNames.length];
        const teacher = this.teacherRepository.create({
          ...teacherData,
          email: teacherData.email.replace('@schule.de', `@${tenant.subdomain}.de`),
          tenantId: tenant.id,
          teacherId: `TEA-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        });
        const saved = await this.teacherRepository.save(teacher);
        teachers.push(saved);
      }
    }

    return teachers;
  }

  private async seedClasses(tenants: Tenant[], teachers: Teacher[]): Promise<Class[]> {
    console.log('🏫 Seeding classes...');
    
    const classNames = ['PR1', 'PR2', 'PR3', 'PR4', 'PR5', 'PR6', '7A', '7B', '8A', '8B', '9A', '9B', '10A', '10B'];
    
    const classes = [];
    for (const tenant of tenants) {
      const tenantTeachers = teachers.filter(t => t.tenantId === tenant.id);
      const classesPerTenant = Math.min(classNames.length, tenantTeachers.length);
      
      for (let i = 0; i < classesPerTenant; i++) {
        const className = classNames[i];
        const assignedTeacher = tenantTeachers[i % tenantTeachers.length];
        
        const classEntity = this.classRepository.create({
          name: className,
          year: new Date().getFullYear(),
          tenantId: tenant.id,
          teacherId: assignedTeacher.id,
          description: `Klasse ${className} - ${tenant.name}`,
          isActive: true,
        });
        const saved = await this.classRepository.save(classEntity);
        classes.push(saved);
      }
    }

    return classes;
  }

  private async seedStudents(tenants: Tenant[], teachers: Teacher[], classes: Class[]): Promise<Student[]> {
    console.log('👨‍🎓 Seeding students...');
    
    const firstNames = [
      'Max', 'Anna', 'Leon', 'Emma', 'Paul', 'Mia', 'Felix', 'Sophie', 'Lucas', 'Lena',
      'Jonas', 'Laura', 'Tim', 'Marie', 'Ben', 'Lisa', 'Noah', 'Sarah', 'Luis', 'Julia',
      'Finn', 'Hannah', 'Elias', 'Lea', 'Moritz', 'Clara', 'Jan', 'Amelie', 'Tom', 'Nele',
      'Nico', 'Zoe', 'David', 'Maja', 'Simon', 'Lara', 'Fabian', 'Pia', 'Marco', 'Ida',
    ];

    const lastNames = [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker',
      'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf',
      'Schröder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun', 'Krüger', 'Hofmann',
      'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
    ];

    const students = [];
    for (const tenant of tenants) {
      const tenantClasses = classes.filter(c => c.tenantId === tenant.id);
      const tenantTeachers = teachers.filter(t => t.tenantId === tenant.id);
      
      const studentsPerTenant = Math.floor(Math.random() * 100) + 150; // 150-250 students per tenant
      
      for (let i = 0; i < studentsPerTenant; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const selectedClass = tenantClasses[Math.floor(Math.random() * tenantClasses.length)];
        const assignedTeacher = tenantTeachers[Math.floor(Math.random() * tenantTeachers.length)];
        
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${tenant.subdomain}.de`;
        const ipadCode = this.generateIpadCode();
        const studentId = `STU-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        
        const student = this.studentRepository.create({
          studentId,
          firstName,
          lastName,
          email,
          office365Password: `Temp${Math.floor(Math.random() * 1000)}!`,
          ipadCode,
          className: selectedClass.name,
          classAddition: Math.random() > 0.7 ? (['A', 'B', 'C'][Math.floor(Math.random() * 3)] as 'A' | 'B' | 'C') : undefined,
          teacherId: assignedTeacher.id,
          tenantId: tenant.id,
          classId: selectedClass.id,
        });
        
        try {
          const saved = await this.studentRepository.save(student);
          students.push(saved);
        } catch (error) {
          // Skip duplicate emails
          console.log(`Skipping duplicate student: ${email}`);
        }
      }
    }

    return students;
  }

  private generateIpadCode(): string {
    const length = Math.random() > 0.5 ? 4 : 6;
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  }
}
