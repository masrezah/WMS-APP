import { Module } from '@nestjs/common';
import { LayoutRoutingService } from './layout-routing.service';
import { LayoutRoutingController } from './layout-routing.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LayoutRoutingController],
  providers: [LayoutRoutingService],
  exports: [LayoutRoutingService]
})
export class LayoutRoutingModule {}
