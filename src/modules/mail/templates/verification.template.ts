import { baseTemplate } from './base.template';

export const verificationEmailTemplate = (
  name: string,
  verificationUrl: string,
) => {
  const content = `
    <h1>Welcome to Saas, ${name}!</h1>
    <p>We're excited to have you on board. To get started, please verify your email address by clicking the button below:</p>
    <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
    </div>
    <p>This link will expire in 24 hours for security reasons.</p>
    <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
  `;

  return baseTemplate(content);
};
