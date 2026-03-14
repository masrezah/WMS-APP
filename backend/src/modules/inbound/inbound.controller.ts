import { Controller, UseGuards } from '@nestjs/common';
// Tambahkan /guards/ di tengah path-nya
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/guards/get-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('inbound')
export class InboundController {}
