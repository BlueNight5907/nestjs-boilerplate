import { UseInterceptors } from '@nestjs/common';
import { HttpAuditLogInterceptor } from 'interceptors';

export function AuditLogDecorator() {
  return UseInterceptors(HttpAuditLogInterceptor);
}
