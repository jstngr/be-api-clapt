import { baseTemplate } from './base.template';

export const resetPasswordTemplate = (name: string, resetUrl: string) => {
  const content = `
    <h1>Reset Your Password</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
    </div>
    <p>This link will expire in 15 minutes for security reasons.</p>
    <p>If you didn't request this password reset, you can safely ignore this email.</p>
    <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
  `;

  return baseTemplate(content);
};
