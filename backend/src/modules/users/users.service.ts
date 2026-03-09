import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk mencari user berdasarkan email (Dipakai saat Login nanti)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Fungsi untuk Register (Bikin Perusahaan + Akun Adminnya)
  async createTenantAndUser(tenantName: string, userName: string, email: string, passwordPlain: string) {
    // 1. Hash password biar aman (tidak teks telanjang di database)
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    // 2. Gunakan Prisma Transaction agar kalau satu gagal, batal semua
    return this.prisma.$transaction(async (tx) => {
      // Buat Tenant (Perusahaan)
      const tenant = await tx.tenant.create({
        data: {
          name: tenantName,
        },
      });

      // Buat User sebagai TENANT_ADMIN yang terikat dengan perusahaan di atas
      const user = await tx.user.create({
        data: {
          tenant_id: tenant.id,
          name: userName,
          email: email,
          password: hashedPassword,
          role: 'TENANT_ADMIN',
        },
      });

      return { tenant, user };
    });
  }
}