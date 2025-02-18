import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Res,
  HttpStatus,
  Delete,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LocalAuthGuard,
  JwtAuthGuard,
  GoogleAuthGuard,
  MagicLinkAuthGuard,
} from './guards';
import {
  RegisterDto,
  LoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle({ register: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    this.logger.debug('Registration attempt with payload:', {
      ...registerDto,
      password: '[REDACTED]',
      confirmPassword: '[REDACTED]',
    });
    try {
      const result = await this.authService.register(registerDto);
      this.logger.debug('Registration successful');
      return result;
    } catch (error) {
      this.logger.error('Registration failed:', {
        message: error.message,
        stack: error.stack,
      });

      if (error instanceof BadRequestException) {
        const response = error.getResponse();
        throw new BadRequestException({
          message: 'Validation failed',
          details:
            typeof response === 'object' ? response : { error: response },
        });
      }
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Throttle({ login: { limit: 5, ttl: 60 } })
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Req() req) {
    return this.authService.login(req.user);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google login' })
  googleAuth() {
    // Google OAuth initiation
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend with token' })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { access_token } = await this.authService.googleLogin(req.user);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`,
    );
  }

  @Post('magic-link')
  @Throttle({ 'magic-link': { limit: 3, ttl: 60 } })
  @ApiOperation({ summary: 'Request magic link login' })
  @ApiResponse({ status: 200, description: 'Magic link sent if email exists' })
  async sendMagicLink(@Body('email') email: string) {
    await this.authService.sendMagicLink(email);
    return { message: 'Magic link sent if email exists' };
  }

  @Get('magic-link/callback')
  @UseGuards(MagicLinkAuthGuard)
  @ApiOperation({ summary: 'Magic link callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend with token' })
  async magicLinkCallback(@Req() req, @Res() res: Response) {
    const { access_token } = await this.authService.login(req.user);
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${access_token}`,
    );
  }

  @Post('forgot-password')
  @Throttle({ 'forgot-password': { limit: 3, ttl: 60 } })
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Reset link sent if email exists' })
  async forgotPassword(@Body('email') email: string) {
    await this.authService.forgotPassword(email);
    return { message: 'Reset link sent if email exists' };
  }

  @Post('reset-password')
  @Throttle({ 'reset-password': { limit: 3, ttl: 60 } })
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
    );
    return { message: 'Password reset successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      req.user.id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user' })
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('account')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully' })
  async deleteAccount(@Req() req) {
    await this.authService.deleteAccount(req.user.id);
    return { message: 'Account deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout current user' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Req() req, @Res() res: Response) {
    req.session.destroy();
    res.clearCookie('connect.sid');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '1234' },
      },
    },
  })
  async verifyEmail(@Body('code') code: string) {
    return this.authService.verifyEmail(code);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification code' })
  @ApiResponse({ status: 200, description: 'Verification code sent' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
    },
  })
  async resendVerificationCode(@Body('email') email: string) {
    return this.authService.resendVerificationCode(email);
  }
}
