import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Paksa baca .env biar nggak kena error SASL password
dotenv.config();

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // 1. Ambil URL database
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL tidak ditemukan di file .env!');
    }

    // 2. Bikin Pool & Adapter khusus aturan Prisma 7
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // 3. Masukkan adapter ke super() biar Prisma nggak ngamuk!
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // 👇 MESIN GAIB (A3) TETAP ADA DI SINI 👇
  withTenant(tenantId: string) {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const anyArgs = args as any;

            // Daftar tabel yang butuh disisipi tenant_id
            const tenantModels = [
              'User',
              'Product',
              'Warehouse',
              'Location',
              'InventoryBatch',
              'TransactionLog',
            ];

            if (tenantModels.includes(model as string)) {
              // Filter Otomatis untuk Pencarian/Update/Delete
              const readWriteOps = [
                'findUnique',
                'findFirst',
                'findMany',
                'update',
                'updateMany',
                'delete',
                'deleteMany',
                'count',
              ];
              if (readWriteOps.includes(operation)) {
                anyArgs.where = { ...anyArgs.where, tenant_id: tenantId };
              }

              // Sisip Otomatis untuk Create
              if (['create', 'createMany'].includes(operation)) {
                if (anyArgs.data && Array.isArray(anyArgs.data)) {
                  anyArgs.data = anyArgs.data.map((item: any) => ({
                    ...item,
                    tenant_id: tenantId,
                  }));
                } else if (anyArgs.data) {
                  anyArgs.data.tenant_id = tenantId;
                }
              }
            }

            return query(anyArgs);
          },
        },
      },
    });
  }
}
