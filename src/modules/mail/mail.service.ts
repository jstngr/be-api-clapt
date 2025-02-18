import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../users/entities/user.entity';
import { verificationEmailTemplate } from './templates/verification.template';
import { resetPasswordTemplate } from './templates/reset-password.template';
import { magicLinkTemplate } from './templates/magic-link.template';
import { welcomeTemplate } from './templates/welcome.template';
import { accountDeletionTemplate } from './templates/account-deletion.template';
import { passwordChangedTemplate } from './templates/password-changed.template';
import { verificationCodeTemplate } from './templates/verification-code.template';
import { Project } from '../projects/entities/project.entity';
import { ProjectMember } from '../projects/entities/project-member.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logoUrl: string;
  private readonly supportUrl: string;
  private readonly frontendUrl: string;
  private readonly dashboardUrl: string;
  private readonly securitySettingsUrl: string;
  private transporter: nodemailer.Transporter;

  constructor(
    private configService: ConfigService,
    @InjectQueue('mail') private mailQueue: Queue,
  ) {
    this.logoUrl = this.configService.get('LOGO_URL') || '';
    this.supportUrl = this.configService.get('SUPPORT_URL') || '';
    this.frontendUrl = this.configService.get('FRONTEND_URL') || '';
    this.dashboardUrl = `${this.frontendUrl}/dashboard`;
    this.securitySettingsUrl = `${this.frontendUrl}/settings/security`;

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST') || '',
      port: parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10),
      secure: true,
      auth: {
        user: this.configService.get<string>('SMTP_USER') || '',
        pass: this.configService.get<string>('SMTP_PASS') || '',
      },
    });
  }

  private replaceTemplateVariables(template: string): string {
    return template
      .replace(/{{logoUrl}}/g, this.logoUrl)
      .replace(/{{supportUrl}}/g, this.supportUrl)
      .replace(/{{dashboardUrl}}/g, this.dashboardUrl)
      .replace(/{{securitySettingsUrl}}/g, this.securitySettingsUrl);
  }

  private async addToQueue(
    to: string,
    subject: string,
    html: string,
    priority = 0,
  ) {
    await this.mailQueue.add('send-mail', { to, subject, html }, { priority });
  }

  async sendWelcomeEmail(user: User) {
    const html = this.replaceTemplateVariables(welcomeTemplate(user.firstname));
    await this.addToQueue(user.email, 'Welcome to Saas!', html, 1);
  }

  async sendVerificationEmail(user: User, token: string) {
    const verificationUrl = `${this.frontendUrl}/verify-email?token=${token}`;
    const html = this.replaceTemplateVariables(
      verificationEmailTemplate(user.firstname, verificationUrl),
    );
    await this.addToQueue(user.email, 'Verify your email address', html, 2);
  }

  async sendPasswordResetEmail(user: User, token: string) {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    const html = this.replaceTemplateVariables(
      resetPasswordTemplate(user.firstname, resetUrl),
    );
    await this.addToQueue(user.email, 'Reset your password', html, 2);
  }

  async sendMagicLink(user: User, token: string) {
    const loginUrl = `${this.frontendUrl}/magic-link?token=${token}`;
    const html = this.replaceTemplateVariables(
      magicLinkTemplate(user.firstname, loginUrl),
    );
    await this.addToQueue(user.email, 'Your login link', html, 2);
  }

  async sendPasswordChangedEmail(user: User) {
    const html = this.replaceTemplateVariables(
      passwordChangedTemplate(user.firstname),
    );
    await this.addToQueue(user.email, 'Password Changed Successfully', html, 1);
  }

  async sendAccountDeletionEmail(user: User) {
    const html = this.replaceTemplateVariables(
      accountDeletionTemplate(user.firstname),
    );
    await this.addToQueue(user.email, 'Account Deletion Confirmation', html, 1);
  }

  async sendVerificationEmailNodemailer(email: string, token: string) {
    const verificationUrl = `${this.frontendUrl}/auth/verify-email?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: 'Verify your email address',
      html: `Please click <a href="${verificationUrl}">here</a> to verify your email address.`,
    });
  }

  async sendPasswordResetEmailNodemailer(email: string, token: string) {
    const resetUrl = `${this.frontendUrl}/auth/reset-password?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Please click <a href="${resetUrl}">here</a> to reset your password.`,
    });
  }

  async sendMagicLinkNodemailer(email: string, token: string) {
    const loginUrl = `${this.frontendUrl}/auth/magic-link/callback?token=${token}`;
    await this.transporter.sendMail({
      to: email,
      subject: 'Your login link',
      html: `Click <a href="${loginUrl}">here</a> to log in to your account.`,
    });
  }

  async sendVerificationCode(user: User, code: string) {
    const html = this.replaceTemplateVariables(
      verificationCodeTemplate(user.firstname, code),
    );
    await this.addToQueue(user.email, 'Verify your email address', html, 2);
  }

  async sendProjectInvitation(
    user: User,
    project: Project,
    inviter: User,
    projectMember: ProjectMember,
  ) {
    const invitationUrl = `${this.frontendUrl}/projects/${project.id}/invitations/${projectMember.id}`;
    const html = `
      <h2>Project Invitation</h2>
      <p>Hi ${user.firstname},</p>
      <p>${inviter.fullName} has invited you to join the project "${project.name}" as a ${projectMember.role}.</p>
      <p>Click <a href="${invitationUrl}">here</a> to accept or decline the invitation.</p>
      <p>If you did not expect this invitation, you can safely ignore this email.</p>
    `;
    await this.addToQueue(
      user.email,
      `Invitation to join project "${project.name}"`,
      html,
      1,
    );
  }

  async sendProjectInvitationToNewUser(
    email: string,
    project: Project,
    inviter: User,
    projectMember: ProjectMember,
  ) {
    const signupUrl = `${this.frontendUrl}/signup?invitation=${projectMember.id}`;
    const html = `
      <h2>Project Invitation</h2>
      <p>Hello,</p>
      <p>${inviter.fullName} has invited you to join the project "${project.name}" as a ${projectMember.role}.</p>
      <p>Since you don't have an account yet, you'll need to create one first.</p>
      <p>Click <a href="${signupUrl}">here</a> to create your account and accept the invitation.</p>
      <p>If you did not expect this invitation, you can safely ignore this email.</p>
    `;
    await this.addToQueue(
      email,
      `Invitation to join project "${project.name}"`,
      html,
      1,
    );
  }
}
