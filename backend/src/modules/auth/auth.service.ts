import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 1. Fungsi Validasi User (Cek Email & Password)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Buang properti password dari object yang di-return demi keamanan
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Fungsi Login (Generate JWT Token)
  async login(user: any) {
    // Payload adalah data yang diselipkan ke dalam Token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenant_id, // Info krusial untuk Blueprint SaaS
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
      },
    };
  }

  // 3. Fungsi Register (Meneruskan dari inputan User ke UsersService)
  async register(registerDto: any) {
    // Cek apakah email sudah terdaftar
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email sudah terdaftar!');
    }

    return this.usersService.createTenantAndUser(
      registerDto.tenantName,
      registerDto.userName,
      registerDto.email,
      registerDto.password,
    );
  }
}
