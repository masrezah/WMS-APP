import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // <--- INI SANGAT PENTING, memberi izin module lain untuk memakai UsersService
})
export class UsersModule {}