import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TenantAdmin } from './tenant-admin.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  subdomain: string;

  @Column({ unique: true })
  databaseName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('json', { nullable: true })
  settings: {
    maxStudents: number;
    maxTeachers: number;
    features: string[];
  };

  @OneToMany(() => TenantAdmin, admin => admin.tenant)
  admins: TenantAdmin[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
