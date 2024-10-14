import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// GlobalExceptionsFilter class to catch all exceptions and format them as JSON responses
@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  // Catch method to handle exceptions and format them as JSON responses
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();  // Switch context to HTTP, could be WebSocket or RPC
    const response = ctx.getResponse<Response>(); // Get the response object
    const request = ctx.getRequest<Request>(); // Get the request object

    // Check if it's an instance of HttpException (known HTTP error) or a generic exception
    // If it's an HttpException, get the status code, otherwise default to 500 Internal Server Error
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; 

    // Build the error response object from ErrorResponseDto
    const errorResponse = {
      statusCode: status,
      error: exception instanceof HttpException
          ? exception.getResponse()['error'] // HttpException has built-in error
          : 'Server down',  // Fallback error
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        exception instanceof HttpException
          ? Array.isArray(exception.getResponse()['message']) ? //
            exception.getResponse()['message'].join(', ') : exception.getResponse()['message']  // HttpException has built-in messages
          : 'Internal server error',  // Fallback message
    };

    // Log the exception (you can customize the logging here)
    console.error({
      exception,  // actual exception object for debugging
      message: errorResponse.message,  // Log the error message
    });

    // Send the response with appropriate status and error message
    response.status(status).json(errorResponse);
  }
}
