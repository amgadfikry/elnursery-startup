// common/decorators/api-response-error.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto';

// Default status code messages for common HTTP status codes
const defaultMessages = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

/* ApiErrorResponses decorator to apply multiple ApiResponse decorators to a single endpoint
    Parameters:
      - codes: An array of status codes for which the decorator will apply ApiResponse decorators
    Returns:
      - Multiple ApiResponse decorators for each status code in the codes array
*/
export function ApiErrorResponses(codes: number[]) {
  return applyDecorators(
    ...codes.map(code =>
      ApiResponse({
        status: code,
        description: defaultMessages[code],
        type: code === 500 ? ErrorResponseDto : null
      })
    )
  );
}
