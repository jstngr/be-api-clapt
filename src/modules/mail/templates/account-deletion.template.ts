import { baseTemplate } from './base.template';

export const accountDeletionTemplate = (name: string) => {
  const content = `
    <h1>Account Deletion Confirmation</h1>
    <p>Hi ${name},</p>
    <p>We're sorry to see you go. Your account has been successfully deleted from our system.</p>
    <p>If you didn't request this deletion, please contact our support team immediately:</p>
    <div style="text-align: center;">
      <a href="{{supportUrl}}" class="button">Contact Support</a>
    </div>
    <p>We hope to see you again in the future!</p>
  `;

  return baseTemplate(content);
};
