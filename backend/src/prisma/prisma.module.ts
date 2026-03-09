import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Membuat PrismaService tersedia di mana saja tanpa perlu import berulang kali
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}