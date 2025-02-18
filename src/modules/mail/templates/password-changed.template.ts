import { baseTemplate } from './base.template';

export const passwordChangedTemplate = (name: string) => {
  const content = `
    <h1>Password Changed Successfully</h1>
    <p>Hi ${name},</p>
    <p>Your password was recently changed. If you made this change, you can safely ignore this email.</p>
    <p>If you didn't change your password, please secure your account immediately:</p>
    <div style="text-align: center;">
      <a href="{{securitySettingsUrl}}" class="button">Review Account Security</a>
    </div>
  `;

  return baseTemplate(content);
};
