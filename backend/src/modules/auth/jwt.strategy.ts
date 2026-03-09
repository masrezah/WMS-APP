import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Mengambil token dari header "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Sebaiknya pakai process.env.JWT_SECRET di production
      secretOrKey: 'rahasia-wms-saas-super-aman', 
    });
  }

  async validate(payload: any) {
    // Data ini akan otomatis di-inject ke "req.user" di setiap request
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId, // Kunci utama untuk mengamankan data antar perusahaan
    };
  }
}