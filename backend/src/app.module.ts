import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
import { PrismaModule } from './prisma/prisma.module'; // PrismaModule
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InventoryModule } from './modules/inventory/inventory.module'; // Pastikan ada
import { TenantsModule } from './modules/tenants/tenants.module';
import { InboundModule } from './modules/inbound/inbound.module';
import { OutboundModule } from './modules/outbound/outbound.module';

@Module({
  imports: [
    PrismaModule,       // PrismaModule ditambahkan pertama
    AuthModule,         // AuthModule
    UsersModule,        // UsersModule
    InventoryModule,    // InventoryModule
    TenantsModule,      // TenantsModule
    InboundModule,      // InboundModule
    OutboundModule,     // OutboundModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}