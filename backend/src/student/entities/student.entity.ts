import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Class } from './class.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  studentId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  office365Password?: string;

  @Column()
  ipadCode: string;

  @Column()
  className: string;

  @Column({ type: 'enum', enum: ['A', 'B', 'C'], nullable: true })
  classAddition?: 'A' | 'B' | 'C';

  @Column({ nullable: true })
  teacherId?: string;

  @Column()
  tenantId: string;

  @Column({ nullable: true })
  classId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Teacher, { nullable: true })
  @JoinColumn({ name: 'teacherId' })
  teacher?: Teacher;

  @ManyToOne(() => Class, { nullable: true })
  @JoinColumn({ name: 'classId' })
  class?: Class;
}