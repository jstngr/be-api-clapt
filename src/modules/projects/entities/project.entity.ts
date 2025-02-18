import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { ProjectMember } from './project-member.entity';

export enum ProjectStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

@Entity('projects')
export class Project {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the project',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'E-commerce Website Redesign',
    description: 'Name of the project',
  })
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.projects, { nullable: false })
  owner: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the project owner',
  })
  @Column({ type: 'uuid', nullable: false })
  ownerId: string;

  @ApiProperty({
    example: '2024-02-01',
    description: 'When the project starts',
  })
  @Column({ type: 'date', nullable: false })
  startDate: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'When the project is due',
  })
  @Column({ type: 'date', nullable: false })
  deadline: Date;

  @ApiProperty({
    example: 50000.0,
    description: 'Project budget in the default currency',
  })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  budget: number;

  @ApiProperty({
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
    description: 'Current status of the project',
  })
  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  status: ProjectStatus;

  @ApiProperty({
    type: () => [ProjectMember],
    description: 'List of project members',
  })
  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @ApiProperty({
    example: '2024-02-01T12:00:00Z',
    description: 'When the project was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2024-02-01T12:00:00Z',
    description: 'When the project was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
