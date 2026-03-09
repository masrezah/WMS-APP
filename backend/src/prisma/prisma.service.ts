import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Menghubungkan ke database saat aplikasi dinyalakan
    await this.$connect();
  }

  async onModuleDestroy() {
    // Memutuskan koneksi saat aplikasi dimatikan
    await this.$disconnect();
  }
}