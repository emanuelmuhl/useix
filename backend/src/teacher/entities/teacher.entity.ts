import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Student } from '../../student/entities/student.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  teacherId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column()
  tenantId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  subjects?: string; // JSON string of subjects

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Student, student => student.teacher)
  students: Student[];
}