import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

/* This interceptor is used to transform the response data to the DTO class instance
    that is passed to it.
    ATTRIBUTES:
    - dtoClass: The DTO class that the response data will be transformed to.
    METHODS:
    - intercept: This method is used to transform the response data to the DTO class instance
      using the class-transformer's plainToInstance method and return the transformed data
      if it's an array or a single object it will be transformed accordingly.
*/
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  // Constructor to initialize the DTO class
  constructor(private readonly dtoClass: new () => T) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    return next.handle().pipe(
      map(data => {
        // Check if data is an array
        if (Array.isArray(data)) {
          return data.map(item => 
            plainToInstance(this.dtoClass, item, {
              excludeExtraneousValues: true,
            })
          );
        } else {
          // If it's a single object
          return plainToInstance(this.dtoClass, data, {
            excludeExtraneousValues: true,
          });
        }
      }),
    );
  }
}
