import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

// Paksa baca file .env dari sistem
dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma',
  // @ts-ignore: Memaksa TypeScript mengabaikan error karena tipe datanya belum update
  migrate: {
    databaseUrl: process.env.DATABASE_URL,
  },
});