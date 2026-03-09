import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TenantsModule } from './modules/tenants/tenants.module';
import { InboundModule } from './modules/inbound/inbound.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OutboundModule } from './modules/outbound/outbound.module';
import { PrismaModule } from './prisma/prisma.module'; // <-- Tambahkan ini

@Module({
  imports: [
    PrismaModule, // <-- Dan ini
    TenantsModule, 
    InboundModule, 
    InventoryModule, 
    OutboundModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}