import { baseTemplate } from './base.template';

export const welcomeTemplate = (name: string) => {
  const content = `
    <h1>Welcome to the Saas Family, ${name}!</h1>
    <p>We're thrilled to have you join us. Here are a few things you can do to get started:</p>
    <ul style="list-style: none; padding: 0;">
      <li style="margin: 16px 0;">
        ✨ Complete your profile
      </li>
      <li style="margin: 16px 0;">
        🔒 Set up two-factor authentication
      </li>
      <li style="margin: 16px 0;">
        📱 Download our mobile app
      </li>
    </ul>
    <div style="text-align: center;">
      <a href="{{dashboardUrl}}" class="button">Go to Dashboard</a>
    </div>
  `;

  return baseTemplate(content);
};
