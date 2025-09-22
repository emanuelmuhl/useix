// Basis-Typen für die gesamte Anwendung

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mandant (Schule)
export interface Tenant extends BaseEntity {
  name: string;
  subdomain: string;
  databaseName: string;
  isActive: boolean;
  settings: TenantSettings;
}

export interface TenantSettings {
  maxStudents: number;
  maxTeachers: number;
  features: string[];
}

// Mandanten-Admin
export interface TenantAdmin extends BaseEntity {
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}

// Schüler:in
export interface Student extends BaseEntity {
  tenantId: string;
  studentId: string; // Eindeutige Schüler-ID
  firstName: string;
  lastName: string;
  email: string;
  office365Password?: string;
  ipadCode: string;
  classId: string;
  classAddition?: 'A' | 'B' | 'C';
  teacherId?: string;
}

// Lehrperson
export interface Teacher extends BaseEntity {
  tenantId: string;
  teacherId: string; // Eindeutige Lehrer-ID
  firstName: string;
  lastName: string;
  email?: string;
}

// Klasse
export interface Class extends BaseEntity {
  tenantId: string;
  name: string; // z.B. "PR1", "PR2"
  year: number;
  isActive: boolean;
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
  tenantSubdomain?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'tenant_admin';
    tenantId?: string;
  };
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Export & Import
export interface StudentImportData {
  firstName: string;
  lastName: string;
  email: string;
  office365Password?: string;
  ipadCode: string;
  className: string;
  classAddition?: 'A' | 'B' | 'C';
  teacherName?: string;
}

export interface ExportFilter {
  classId?: string;
  teacherId?: string;
  year?: number;
}
