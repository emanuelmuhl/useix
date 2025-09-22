import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Student } from './entities/student.entity';
import { Class } from './entities/class.entity';
import { CreateStudentDto, UpdateStudentDto, ImportStudentsDto, StudentFilterDto } from './dto/student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if email already exists
    const existingStudent = await this.studentRepository.findOne({
      where: { email: createStudentDto.email }
    });

    if (existingStudent) {
      throw new ConflictException('Email already exists');
    }

    // Generate unique student ID
    const studentId = await this.generateStudentId();

    // Find or create class
    let classEntity = await this.classRepository.findOne({
      where: { 
        name: createStudentDto.className,
        tenantId: createStudentDto.tenantId 
      }
    });

    if (!classEntity) {
      classEntity = this.classRepository.create({
        name: createStudentDto.className,
        tenantId: createStudentDto.tenantId,
        year: new Date().getFullYear(),
        isActive: true,
      });
      await this.classRepository.save(classEntity);
    }

    const student = this.studentRepository.create({
      ...createStudentDto,
      studentId,
      classId: classEntity.id,
    });

    const savedStudent = await this.studentRepository.save(student);
    return Array.isArray(savedStudent) ? savedStudent[0] : savedStudent;
  }

  async findAll(filters: StudentFilterDto = {}): Promise<{
    data: Student[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { search, className, teacherId, page = 1, limit = 10 } = filters;
    
    const whereClause: FindOptionsWhere<Student> = {};
    
    if (search) {
      whereClause.firstName = Like(`%${search}%`);
      // Note: TypeORM doesn't support OR conditions easily in FindOptionsWhere
      // For production, consider using QueryBuilder for complex searches
    }
    
    if (className) {
      // Would need to join with class entity for this
    }
    
    if (teacherId) {
      whereClause.teacherId = teacherId;
    }

    const [data, total] = await this.studentRepository.findAndCount({
      where: whereClause,
      relations: ['class', 'teacher'],
      order: { lastName: 'ASC', firstName: 'ASC' },
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

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    
    // Check email uniqueness if email is being updated
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingStudent = await this.studentRepository.findOne({
        where: { email: updateStudentDto.email }
      });
      
      if (existingStudent) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(student, updateStudentDto);
    const savedStudent = await this.studentRepository.save(student);
    return Array.isArray(savedStudent) ? savedStudent[0] : savedStudent;
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
  }

  async importStudents(importData: ImportStudentsDto): Promise<{ 
    imported: number; 
    errors: string[];
    students: Student[];
  }> {
    const results = { imported: 0, errors: [], students: [] };
    
    for (const studentData of importData.students) {
      try {
        const student = await this.create({
          ...studentData,
          tenantId: importData.tenantId,
        });
        results.students.push(student);
        results.imported++;
      } catch (error) {
        results.errors.push(`Error importing ${studentData.firstName} ${studentData.lastName}: ${error.message}`);
      }
    }

    return results;
  }

  async exportStudents(tenantId: string, format: 'csv' | 'xlsx' = 'csv'): Promise<{
    data: Student[];
    count: number;
    format: string;
  }> {
    const students = await this.studentRepository.find({
      where: { tenantId },
      relations: ['class', 'teacher'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    
    return {
      data: students,
      count: students.length,
      format,
    };
  }

  async generateStudentId(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `STU-${timestamp}-${random}`;
  }

  async generateIpadCode(): Promise<string> {
    // Generate 4- or 6-digit iPad code
    const length = Math.random() > 0.5 ? 4 : 6;
    return Math.random().toString().slice(2, 2 + length);
  }

  async getStatsByTenant(tenantId: string): Promise<{
    totalStudents: number;
    byClass: { className: string; count: number }[];
    byTeacher: { teacherName: string; count: number }[];
  }> {
    const students = await this.studentRepository.find({
      where: { tenantId },
      relations: ['class', 'teacher'],
    });

    const byClass = students.reduce((acc, student) => {
      const className = student.class?.name || 'Unassigned';
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {});

    const byTeacher = students.reduce((acc, student) => {
      const teacherName = student.teacher ? 
        `${student.teacher.firstName} ${student.teacher.lastName}` : 'Unassigned';
      acc[teacherName] = (acc[teacherName] || 0) + 1;
      return acc;
    }, {});

    return {
      totalStudents: students.length,
      byClass: Object.entries(byClass).map(([className, count]) => ({ 
        className, 
        count: count as number 
      })),
      byTeacher: Object.entries(byTeacher).map(([teacherName, count]) => ({ 
        teacherName, 
        count: count as number 
      })),
    };
  }
}