import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) {}

  async create(createTeacherDto: any): Promise<Teacher> {
    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      teacherId: `TEA-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    });

    return this.teacherRepository.save(teacher);
  }

  async findAll(tenantId?: string): Promise<Teacher[]> {
    const whereClause = tenantId ? { tenantId } : {};
    
    return this.teacherRepository.find({
      where: whereClause,
      relations: ['students'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
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

  async update(id: string, updateTeacherDto: any): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    return this.teacherRepository.save(teacher);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
  }

  async getStudents(teacherId: string): Promise<any[]> {
    const teacher = await this.findOne(teacherId);
    return teacher.students || [];
  }

  async findByTeacherId(teacherId: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { teacherId },
      relations: ['students'],
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    return teacher;
  }
}
