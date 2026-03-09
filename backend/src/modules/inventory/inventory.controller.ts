import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/guards/get-user.decorator';
import { InventoryService } from './inventory.service'; // Pastikan baris ini ada

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  async getStock(@GetUser('tenantId') tenantId: string) {
    return this.inventoryService.getStock(tenantId);
  }
}