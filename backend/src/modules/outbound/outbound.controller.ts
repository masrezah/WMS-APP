import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/guards/get-user.decorator';

@UseGuards(JwtAuthGuard) // Mengunci semua endpoint Outbound
@Controller('outbound')
export class OutboundController {}
