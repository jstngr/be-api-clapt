import { baseTemplate } from './base.template';

export const magicLinkTemplate = (name: string, loginUrl: string) => {
  const content = `
    <h1>Login to Saas</h1>
    <p>Hi ${name},</p>
    <p>Click the button below to securely log in to your Saas account:</p>
    <div style="text-align: center;">
        <a href="${loginUrl}" class="button">Log In to Saas</a>
    </div>
    <p>This magic link will expire in 15 minutes for security reasons.</p>
    <p>If you didn't request this login link, please ignore this email.</p>
    <p>If the button above doesn't work, you can also copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${loginUrl}</p>
  `;

  return baseTemplate(content);
};
