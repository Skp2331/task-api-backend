/**
 * HTTP Exception Filter
 * ---------------------
 * This filter catches all HTTP exceptions and formats them
 * into a clean, consistent error response.
 * 
 * Without this, Nest.js returns errors in its default format.
 * With this filter, we get a cleaner, more user-friendly format.
 */

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        // Get the response object from the context
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // Get the status code from the exception
        const status = exception.getStatus();

        // Get the exception response (can be string or object)
        const exceptionResponse = exception.getResponse();

        // Build a clean error response
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            message: this.extractMessage(exceptionResponse),
        };

        // Send the error response
        response.status(status).json(errorResponse);
    }

    /**
     * Extract the message from the exception response
     * The response can be a string or an object with a message property
     */
    private extractMessage(response: string | object): string | string[] {
        if (typeof response === 'string') {
            return response;
        }

        if (typeof response === 'object' && 'message' in response) {
            return (response as any).message;
        }

        return 'An error occurred';
    }
}
