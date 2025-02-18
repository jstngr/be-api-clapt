import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectMemberRole } from '../entities/project-member.entity';

export class InviteMemberDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user to invite',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    enum: ProjectMemberRole,
    example: ProjectMemberRole.COLLABORATOR,
    description: 'Role to assign to the invited member',
  })
  @IsEnum(ProjectMemberRole)
  @IsNotEmpty()
  role: ProjectMemberRole;
}
