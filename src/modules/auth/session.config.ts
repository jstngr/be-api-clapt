import { ConfigService } from '@nestjs/config';
const session = require('express-session');
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

export const configureSession = async (configService: ConfigService) => {
  const redisClient = createClient({
    url: configService.get('REDIS_URL'),
  });

  await redisClient.connect();

  const store = new RedisStore({
    client: redisClient,
    prefix: 'saas:',
  });

  return session({
    store,
    secret: configService.get('SESSION_SECRET') || '',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: configService.get('NODE_ENV') === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  });
};
