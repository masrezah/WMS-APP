import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/guards/get-user.decorator';
import { InventoryService } from './inventory.service';

@UseGuards(JwtAuthGuard) // Satpam jagain semua pintu di bawah ini
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // 1. Pintu buat liat stok (GET http://localhost:3000/inventory/stock)
  @Get('stock')
  async getStock(@GetUser('tenantId') tenantId: string) {
    return this.inventoryService.getStock(tenantId);
  }

  // 👇 2. PINTU YANG HILANG: Buat daftar produk (POST http://localhost:3000/inventory/products)
  @Post('products')
  async createProduct(
    @GetUser('tenantId') tenantId: string, // Ambil ID perusahaan dari token
    @Body() body: any // Ambil isi paket JSON dari Postman
  ) {
    return this.inventoryService.createProduct(tenantId, body);
  }
}