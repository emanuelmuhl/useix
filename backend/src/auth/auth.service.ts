import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TenantService } from '../tenant/tenant.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tenantService: TenantService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Try admin login first
    if (email === 'admin@userix.com' && password === 'admin123') {
      return {
        id: 'admin-1',
        email: 'admin@userix.com',
        firstName: 'System',
        lastName: 'Admin',
        role: 'admin',
      };
    }

    // Try tenant admin login
    const tenantAdmin = await this.tenantService.validateAdminCredentials(email, password);
    if (tenantAdmin) {
      return {
        id: tenantAdmin.id,
        email: tenantAdmin.email,
        firstName: tenantAdmin.firstName,
        lastName: tenantAdmin.lastName,
        role: 'tenant_admin',
        tenantId: tenantAdmin.tenantId,
      };
    }

    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId || null,
    };

    return {
      success: true,
      data: {
        accessToken: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          tenantId: user.tenantId || null,
        },
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async refreshToken(user: any) {
    return this.login(user);
  }
}