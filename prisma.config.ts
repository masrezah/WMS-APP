// @ts-nocheck
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Karena filenya di luar, path schemanya harus masuk ke folder backend dulu
  schema: './backend/prisma/schema.prisma',
  migrate: {
    databaseUrl: process.env.DATABASE_URL,
  },
});