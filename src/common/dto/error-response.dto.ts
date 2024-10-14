import { ApiProperty } from '@nestjs/swagger';

// Data transfer object for error responses
export class ErrorResponseDto {
  // HTTP status code of the error
  @ApiProperty({ example: 400, description: 'HTTP status code of the error' })
  statusCode: number;

  // Detailed explanation of the error
  @ApiProperty({ example: 'Bad Request', description: 'Detailed explanation of the error' })
  error: string;

  // Timestamp of when the error occurred
  @ApiProperty({
    example: '2023-07-26T12:23:34.123Z',
    description: 'Timestamp of when the error occurred',
  })
  timestamp: string;

  // Path route where the error occurred
  @ApiProperty({ example: '/task', description: 'Path where the error occurred' })
  path: string;

  // HTTP method that caused the error
  @ApiProperty({ example: 'POST', description: 'Method erroe occue when apply to path'})
  method: string;

  // Messages that describe the error, if multiple separated by comma
  @ApiProperty({
    example: 'Password contain 1 special case at least',
    description: 'Messgaes that descripe error, if multiple separated by comma'
  })
  message: string;
}
