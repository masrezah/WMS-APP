import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Hanya log mutasi (perubahan data)
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle().pipe(
        tap(async (data: any) => {
          const user = request.user;
          if (!user?.id || !user?.tenant_id) return;

          let action: 'CREATE' | 'UPDATE' | 'DELETE';
          if (method === 'POST') action = 'CREATE';
          else if (method === 'DELETE') action = 'DELETE';
          else action = 'UPDATE';

          // Entity pattern fallback jika tidak spesifik
          const entityPath = request.originalUrl.split('/')[1] || 'Unknown';
          const entityMap: Record<string, string> = {
            'products': 'Product',
            'inbound': 'InventoryBatch',
            'outbound': 'TransactionLog',
            'users': 'User'
          };
          const entity = entityMap[entityPath] || entityPath.toUpperCase();

          try {
            await this.prisma.auditLog.create({
              data: {
                tenant_id: user.tenant_id,
                user_id: user.id,
                action: action,
                entity: entity,
                old_data: action === 'UPDATE' ? { _info: "Old data structure required fetching before update" } : undefined,
                new_data: data ? data : request.body, // Log payload mutasi
              },
            });
            console.log(`[Audit Trail] Logged ${action} on ${entity} by user ${user.id}`);
          } catch (error) {
            console.error('[Audit Trail Error] Failed to insert audit log:', error);
          }
        }),
      );
    }

    return next.handle();
  }
}
