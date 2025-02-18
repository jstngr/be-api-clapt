import { Strategy, User } from 'passport-magic-link';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { MailService } from '../../mail/mail.service';

// Add type declaration for passport-magic-link
declare module 'passport-magic-link' {
  interface User {
    email: string;
  }
}

@Injectable()
export class MagicLinkStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private mailService: MailService,
  ) {
    const secret = configService.get('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    super(
      {
        secret,
        userFields: ['email'],
        tokenField: 'token',
        verifyUserAfterToken: true,
        ttl: 15 * 60, // 15 minutes in seconds
      },
      async (user: User, token: string) => {
        await this.mailService.sendMagicLinkNodemailer(user.email, token);
        return true;
      }
    );
  }

  async validate(payload: any): Promise<any> {
    let existingUser = await this.authService.validateUser(payload.email, '');
    if (!existingUser) {
      // Create user with a random password if they don't exist
      const password = Math.random().toString(36).slice(-8) + 'A1!'; // Ensure password meets requirements
      const registerDto = {
        email: payload.email,
        password,
        confirmPassword: password,
        firstname: payload.email.split('@')[0],
        lastname: '',
      };
      existingUser = await this.authService.register(registerDto);
    }
    return existingUser;
  }
}
