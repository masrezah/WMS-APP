import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WmsService } from './wms.service';

@Controller('v1')
export class WmsController {
  constructor(private readonly wmsService: WmsService) {}

  @Get('utils/generate-number')
  async generateNumber(@Query('tenant_id') tenantId: string, @Query('doc_type') docType?: string) {
    return this.wmsService.generateNumber(tenantId, docType);
  }

  @Post('receiving')
  async receiving(@Body() body: any) {
    return this.wmsService.receiving(body);
  }

  @Post('put-away')
  async putAway(@Body() body: any) {
    return this.wmsService.putAway(body);
  }

  @Get('storage/stock')
  async getStock(@Query('tenant_id') tenantId: string) {
    return this.wmsService.getStock(tenantId);
  }

  @Post('storage/opname')
  async stockOpname(@Body() body: any) {
    return this.wmsService.stockOpname(body);
  }

  @Get('order/check')
  async checkOrder(@Query('tenant_id') tenantId: string, @Query('product_id') productId: string) {
    return this.wmsService.checkOrder(tenantId, productId);
  }

  @Post('order/pick')
  async pickOrder(@Body() body: any) {
    return this.wmsService.pickOrder(body);
  }

  @Post('shipment')
  async shipment(@Body() body: any) {
    return this.wmsService.shipment(body);
  }

  @Get('transaction-logs')
  async logs(@Query('tenant_id') tenantId: string, @Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 50;
    return this.wmsService.getTransactionLogs(tenantId, parsed);
  }

  @Get('warehouses')
  async listWarehouses(@Query('tenant_id') tenantId: string) {
    return this.wmsService.listWarehouses(tenantId);
  }

  @Post('warehouses')
  async createWarehouse(@Body() body: any) {
    return this.wmsService.createWarehouse(body);
  }

  @Post('locations/generate')
  async generateLocations(@Body() body: any) {
    return this.wmsService.generateLocations(body);
  }
}
