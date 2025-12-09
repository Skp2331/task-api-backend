/**
 * Auth Module
 * -----------
 * Groups all authentication-related components.
 * Configures JWT with settings from environment variables.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        // Import UsersModule to use UsersService
        UsersModule,

        // Configure Passport with JWT as default strategy
        PassportModule.register({ defaultStrategy: 'jwt' }),

        // Configure JWT with async to access ConfigService
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
                },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    // Export these so other modules can use authentication
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
