import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { SessionModule } from './session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './config/configuration';
import { validate } from './config/env.validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        throttlers: [{
          ttl: 60,
          limit: config.get('NODE_ENV') === 'production' ? 10 : 100,
        }],
      }),
    }),

    // Core modules
    PrismaModule,
    SessionModule,

    // Feature modules
    AuthModule,
  ],
})
export class AppModule {}
