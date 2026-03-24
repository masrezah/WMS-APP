import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

// Decorator ini bisa ditaruh di atas controller / endpoint handler untuk membatasi akses role
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
