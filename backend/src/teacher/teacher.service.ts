import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto, UpdateTeacherDto, TeacherFilterDto } from './dto/teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    // Check if email already exists (if provided)
    if (createTeacherDto.email) {
      const existingTeacher = await this.teacherRepository.findOne({
        where: { email: createTeacherDto.email }
      });

      if (existingTeacher) {
        throw new ConflictException('Email already exists');
      }
    }

    // Generate unique teacher ID
    const teacherId = await this.generateTeacherId();

    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      teacherId,
    });

    const savedTeacher = await this.teacherRepository.save(teacher);
    return Array.isArray(savedTeacher) ? savedTeacher[0] : savedTeacher;
  }

  async findAll(filters: TeacherFilterDto = {}): Promise<{
    data: Teacher[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { search, tenantId, department, isActive, page = 1, limit = 10 } = filters;
    
    const queryBuilder = this.teacherRepository.createQueryBuilder('teacher')
      .leftJoinAndSelect('teacher.students', 'students');
    
    if (search) {
      queryBuilder.andWhere(
        '(teacher.firstName ILIKE :search OR teacher.lastName ILIKE :search OR teacher.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    if (tenantId) {
      queryBuilder.andWhere('teacher.tenantId = :tenantId', { tenantId });
    }
    
    if (department) {
      queryBuilder.andWhere('teacher.department = :department', { department });
    }
    
    if (isActive !== undefined) {
      queryBuilder.andWhere('teacher.isActive = :isActive', { isActive });
    }

    queryBuilder
      .orderBy('teacher.lastName', 'ASC')
      .addOrderBy('teacher.firstName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['students'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    
    // Check email uniqueness if email is being updated
    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email) {
      const existingTeacher = await this.teacherRepository.findOne({
        where: { email: updateTeacherDto.email }
      });
      
      if (existingTeacher) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(teacher, updateTeacherDto);
    const savedTeacher = await this.teacherRepository.save(teacher);
    return Array.isArray(savedTeacher) ? savedTeacher[0] : savedTeacher;
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
  }

  async getStatsByTenant(tenantId: string): Promise<{
    totalTeachers: number;
    activeTeachers: number;
    byDepartment: { department: string; count: number }[];
    studentsPerTeacher: { teacherName: string; studentCount: number }[];
  }> {
    const teachers = await this.teacherRepository.find({
      where: { tenantId },
      relations: ['students'],
    });

    const activeTeachers = teachers.filter(t => t.isActive).length;

    const byDepartment = teachers.reduce((acc, teacher) => {
      const dept = teacher.department || 'Unassigned';
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const studentsPerTeacher = teachers.map(teacher => ({
      teacherName: `${teacher.firstName} ${teacher.lastName}`,
      studentCount: teacher.students?.length || 0,
    }));

    return {
      totalTeachers: teachers.length,
      activeTeachers,
      byDepartment: Object.entries(byDepartment).map(([department, count]) => ({ 
        department, 
        count: count as number 
      })),
      studentsPerTeacher,
    };
  }

  async generateTeacherId(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `TEA-${timestamp}-${random}`;
  }

  async importTeachers(tenantId: string, teachersData: CreateTeacherDto[]): Promise<{
    imported: number;
    errors: string[];
    teachers: Teacher[];
  }> {
    const results = { imported: 0, errors: [], teachers: [] };
    
    for (const teacherData of teachersData) {
      try {
        const teacher = await this.create({
          ...teacherData,
          tenantId,
        });
        results.teachers.push(teacher);
        results.imported++;
      } catch (error) {
        results.errors.push(`Error importing ${teacherData.firstName} ${teacherData.lastName}: ${error.message}`);
      }
    }

    return results;
  }

  async exportTeachers(tenantId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<{
    data: Teacher[];
    count: number;
    format: string;
  }> {
    const teachers = await this.teacherRepository.find({
      where: { tenantId },
      relations: ['students'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    
    return {
      data: teachers,
      count: teachers.length,
      format,
    };
  }
}