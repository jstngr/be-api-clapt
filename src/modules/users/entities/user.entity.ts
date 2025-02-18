import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../projects/entities/project.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstname: string;

  @Column({ length: 100 })
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password?: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'verification_code', nullable: true })
  @Exclude()
  verificationCode?: string;

  @Column({ name: 'verification_code_expires_at', nullable: true })
  verificationCodeExpiresAt?: Date;

  @Column({ name: 'reset_password_token', nullable: true })
  @Exclude()
  resetPasswordToken?: string;

  @Column({ name: 'magic_link_token', nullable: true })
  @Exclude()
  magicLinkToken?: string;

  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ name: 'google_id', nullable: true })
  googleId?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ name: 'login_attempts', default: 0 })
  loginAttempts: number;

  @Column({ nullable: true, type: 'timestamp' })
  lockedUntil: Date | null;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @OneToMany(() => Project, (project) => project.owner)
  projects: Project[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  generateFullName() {
    this.fullName = `${this.firstname} ${this.lastname}`.trim();
  }

  // Helper methods
  isLocked(): boolean {
    return Boolean(this.lockedUntil && this.lockedUntil > new Date());
  }

  incrementLoginAttempts() {
    this.loginAttempts = (this.loginAttempts || 0) + 1;
  }

  resetLoginAttempts() {
    this.loginAttempts = 0;
    this.lockedUntil = null;
  }

  lock(durationMs: number) {
    this.lockedUntil = new Date(Date.now() + durationMs);
  }

  updateLastLogin() {
    this.lastLoginAt = new Date();
  }
}
