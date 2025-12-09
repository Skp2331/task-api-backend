/**
 * Main Entry Point
 * -----------------
 * This is where our Nest.js application starts.
 * It sets up validation, CORS, and starts the server.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    // Create the Nest application
    const app = await NestFactory.create(AppModule);

    // Enable CORS (Cross-Origin Resource Sharing)
    // This allows frontend apps on different domains to call our API
    app.enableCors();

    // Set up global validation pipe
    // This automatically validates incoming requests using class-validator decorators
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip properties that don't have decorators
            forbidNonWhitelisted: true, // Throw error if unknown properties are sent
            transform: true, // Auto-transform payloads to DTO instances
        }),
    );

    // Set up global exception filter for clean error responses
    app.useGlobalFilters(new HttpExceptionFilter());

    // Get port from environment or use 3000 as default
    const port = process.env.PORT || 3000;

    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
