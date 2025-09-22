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
    // Für jetzt eine einfache Implementierung
    // TODO: Implementiere echte Benutzervalidierung
    if (email === 'admin@userix.com' && password === 'admin123') {
      return {
        id: 'admin-1',
        email: 'admin@userix.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
      };
    }
    return null;
  }

  async login(user: any, role: 'admin' | 'tenant_admin') {
    const payload = {
      email: user.email,
      sub: user.id,
      role: role,
      tenantId: user.tenantId || null,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: role,
        tenantId: user.tenantId || null,
      },
    };
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
