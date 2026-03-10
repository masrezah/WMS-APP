import { defineConfig, env } from '@prisma/config';
import * as dotenv from 'dotenv';

// Membaca file .env
dotenv.config();

export default defineConfig({
  // Lokasi file schema kamu
  schema: './prisma/schema.prisma',
  
  // Konfigurasi koneksi database untuk proses migrate
  datasource: {
    url: process.env.DATABASE_URL || env('DATABASE_URL'),
  },
});