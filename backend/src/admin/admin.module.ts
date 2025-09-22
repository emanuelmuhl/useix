import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TenantModule } from '../tenant/tenant.module';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [TenantModule, StudentModule, TeacherModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
