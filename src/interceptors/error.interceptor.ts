import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<any>> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((error) => {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          error: error.message || 'Internal server error',
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        if (error instanceof HttpException) {
          return throwError(
            () => new HttpException(response, error.getStatus()),
          );
        }

        // Log unexpected errors
        console.error('Unexpected error:', error);
        return throwError(
          () => new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR),
        );
      }),
    );
  }
}
