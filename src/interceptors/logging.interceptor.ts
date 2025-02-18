import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const response = context.switchToHttp().getResponse();
          const delay = Date.now() - start;

          this.logger.log(
            `${method} ${url} ${response.statusCode} ${delay}ms - ${userAgent}`,
          );
        },
        error: (error: any) => {
          const delay = Date.now() - start;
          this.logger.error(
            `${method} ${url} ${error.status} ${delay}ms - ${userAgent} - Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
