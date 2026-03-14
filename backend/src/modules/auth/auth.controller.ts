import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint: POST /auth/register
  @Post('register')
  async register(@Body() body: any) {
    // Validasi input sederhana (Nanti bisa diganti pakai DTO & class-validator)
    if (!body.tenantName || !body.userName || !body.email || !body.password) {
      throw new UnauthorizedException(
        'Semua field (tenantName, userName, email, password) wajib diisi!',
      );
    }

    const result = await this.authService.register(body);
    return {
      message: 'Registrasi Perusahaan & Admin berhasil',
      data: result,
    };
  }

  // Endpoint: POST /auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email dan password wajib diisi!');
    }

    // Panggil fungsi validasi
    const user = await this.authService.validateUser(body.email, body.password);

    if (!user) {
      throw new UnauthorizedException('Email atau password salah!');
    }

    // Jika valid, cetak token
    return this.authService.login(user);
  }
}
