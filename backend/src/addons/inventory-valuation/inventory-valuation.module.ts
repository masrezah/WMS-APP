import { Module } from '@nestjs/common';
import { InventoryValuationService } from './inventory-valuation.service';
import { InventoryValuationController } from './inventory-valuation.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InventoryValuationController],
  providers: [InventoryValuationService],
  exports: [InventoryValuationService],
})
export class InventoryValuationModule {}
