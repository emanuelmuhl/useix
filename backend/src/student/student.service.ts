import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createStudentDto: any): Promise<Student> {
    const student = this.studentRepository.create({
      ...createStudentDto,
      studentId: `STU-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    });

    return await this.studentRepository.save(student);
  }

  async findAll(tenantId?: string): Promise<Student[]> {
    const whereClause = tenantId ? { tenantId } : {};
    
    return this.studentRepository.find({
      where: whereClause,
      relations: ['class', 'teacher'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['class', 'teacher'],
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: any): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async importStudents(importData: any): Promise<{ imported: number; errors: string[] }> {
    const results = { imported: 0, errors: [] };
    
    for (const studentData of importData.students) {
      try {
        await this.create({
          tenantId: importData.tenantId,
          ...studentData,
        });
        results.imported++;
      } catch (error) {
        results.errors.push(`Error importing ${studentData.firstName} ${studentData.lastName}: ${error.message}`);
      }
    }

    return results;
  }

  async exportToExcel(tenantId: string): Promise<any> {
    const students = await this.findAll(tenantId);
    
    // TODO: Implementiere Excel-Export mit xlsx
    return {
      message: 'Excel export functionality will be implemented',
      count: students.length,
      data: students,
    };
  }

  async generateIpadCode(): Promise<string> {
    // Generiere 4- oder 6-stelligen iPad-Code
    const length = Math.random() > 0.5 ? 4 : 6;
    return Math.random().toString().slice(2, 2 + length);
  }
}
