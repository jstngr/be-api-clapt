import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

@Injectable()
export class SessionService {
  constructor(private configService: ConfigService) {}

  async createSessionMiddleware() {
    let store;

    if (this.configService.get('NODE_ENV') === 'production') {
      const redisClient = createClient({
        url: this.configService.get('redis.url'),
        password: this.configService.get('redis.password'),
      });

      await redisClient.connect();

      store = new RedisStore({
        client: redisClient,
        prefix: 'clapt:',
      });
    }

    const sessionSecret = this.configService.get<string>('session.secret');
    if (!sessionSecret) {
      throw new Error('Session secret is not configured');
    }

    return session({
      store,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: 'sid',
      cookie: {
        maxAge: 60 * 60 * 1000, // 1 hour
        secure: this.configService.get('NODE_ENV') === 'production',
        sameSite: this.configService.get('NODE_ENV') === 'production' ? 'strict' : 'lax',
      },
    });
  }
} 