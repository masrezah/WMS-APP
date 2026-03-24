import { Controller, Get, Param, Query } from '@nestjs/common';
import { InventoryValuationService } from './inventory-valuation.service';

@Controller('addons/inventory-valuation')
export class InventoryValuationController {
  constructor(private readonly valuationService: InventoryValuationService) {}

  @Get(':tenantId/summary')
  async getValuationSummary(
    @Param('tenantId') tenantId: string,
    @Query('method') method: 'FIFO' | 'MOVING_AVERAGE' = 'FIFO',
  ) {
    return this.valuationService.calculateTenantInventoryValue(tenantId, method);
  }

  @Get(':tenantId/product/:productId')
  async getProductValuation(
    @Param('tenantId') tenantId: string,
    @Param('productId') productId: string,
    @Query('method') method: 'FIFO' | 'MOVING_AVERAGE' = 'FIFO',
  ) {
    return this.valuationService.calculateProductValue(tenantId, productId, method);
  }
}
