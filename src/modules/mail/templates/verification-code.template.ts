import { baseTemplate } from './base.template';

export const verificationCodeTemplate = (name: string, code: string) => {
  const content = `
    <h1>Welcome to Saas, ${name}!</h1>
    <p>We're excited to have you on board. To verify your email address, please enter the following code:</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #4A5568; background: #EDF2F7; padding: 20px; border-radius: 8px; display: inline-block;">
        ${code}
      </div>
    </div>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't request this verification, you can safely ignore this email.</p>
  `;

  return baseTemplate(content);
};
