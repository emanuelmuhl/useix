import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Class } from './class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @Column({ unique: true })
  studentId: string; // Eindeutige Schüler-ID

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  office365Password: string;

  @Column()
  ipadCode: string;

  @Column()
  classId: string;

  @Column({ type: 'enum', enum: ['A', 'B', 'C'], nullable: true })
  classAddition: 'A' | 'B' | 'C';

  @Column({ nullable: true })
  teacherId: string;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'classId' })
  class: Class;

  @ManyToOne(() => Teacher)
  @JoinColumn({ name: 'teacherId' })
  teacher: Teacher;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
