/**
 * App Module
 * ----------
 * This is the root module of our application.
 * It imports and connects all other modules together.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
    imports: [
        // ConfigModule loads environment variables from .env file
        // isGlobal: true makes it available everywhere without importing
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // TypeOrmModule connects to our PostgreSQL database
        // We use forRootAsync to access ConfigService for environment variables
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                // Auto-load all entities (no need to list them manually)
                autoLoadEntities: true,
                // Sync database schema automatically (disable in production!)
                synchronize: true,
            }),
        }),

        // Feature modules
        AuthModule,
        UsersModule,
        TasksModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
