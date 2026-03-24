import { Controller, Get, Param, Query } from '@nestjs/common';
import { LayoutRoutingService } from './layout-routing.service';

@Controller('addons/layout-routing')
export class LayoutRoutingController {
  constructor(private readonly routingService: LayoutRoutingService) {}

  @Get(':warehouseId/validate-aisle')
  async validateAisle(
    @Param('warehouseId') warehouseId: string,
    @Query('vehicleType') vehicleType: string,
  ) {
    return this.routingService.validateAisleWidth(warehouseId, vehicleType);
  }

  @Get(':warehouseId/picking-route')
  async getPickingRoute(
    @Param('warehouseId') warehouseId: string,
    @Query('locationIds') locationIds: string,
  ) {
    const ids = locationIds ? locationIds.split(',') : [];
    return this.routingService.calculateOptimalRoute(warehouseId, ids);
  }
}
