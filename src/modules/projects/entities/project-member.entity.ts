import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Project } from './project.entity';
import { User } from '../../users/entities/user.entity';

export enum ProjectMemberRole {
  COLLABORATOR = 'collaborator',
  COLLABORATOR_RESTRICTED = 'collaborator_restricted',
  CLIENT_READ = 'client_read',
  CLIENT_READ_WRITE = 'client_read_write',
}

export enum ProjectMemberStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

@Entity('project_members')
export class ProjectMember {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the project member',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the project this member belongs to',
  })
  @Column({ type: 'uuid' })
  projectId: string;

  @ApiProperty({ type: () => User, nullable: true })
  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user (null for pending invitations)',
    nullable: true,
  })
  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the invited user',
  })
  @Column({ type: 'varchar' })
  email: string;

  @ApiProperty({
    enum: ProjectMemberRole,
    example: ProjectMemberRole.COLLABORATOR,
    description: 'Role of the member in the project',
  })
  @Column({
    type: 'enum',
    enum: ProjectMemberRole,
    default: ProjectMemberRole.COLLABORATOR,
  })
  role: ProjectMemberRole;

  @ApiProperty({
    enum: ProjectMemberStatus,
    example: ProjectMemberStatus.PENDING,
    description: 'Current status of the member invitation',
  })
  @Column({
    type: 'enum',
    enum: ProjectMemberStatus,
    default: ProjectMemberStatus.PENDING,
  })
  status: ProjectMemberStatus;

  @ApiProperty({
    example: '2024-02-01T12:00:00Z',
    description: 'When the member joined the project',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  joinedAt: Date;

  @ApiProperty({
    example: '2024-02-01T12:00:00Z',
    description: 'When the member record was created',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-01T12:00:00Z',
    description: 'When the member record was last updated',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
