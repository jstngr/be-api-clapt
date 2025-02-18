import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ProjectMember,
  ProjectMemberRole,
  ProjectMemberStatus,
} from './entities/project-member.entity';
import { Project } from './entities/project.entity';
import { User } from '../users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProjectMembersService {
  constructor(
    @InjectRepository(ProjectMember)
    private projectMembersRepository: Repository<ProjectMember>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mailService: MailService,
  ) {}

  async inviteMember(
    projectId: string,
    inviteMemberDto: InviteMemberDto,
    currentUser: User,
  ): Promise<ProjectMember> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['members'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== currentUser.id) {
      throw new ForbiddenException('Only project owner can invite members');
    }

    const existingMember = await this.projectMembersRepository.findOne({
      where: { projectId, email: inviteMemberDto.email },
    });

    if (existingMember) {
      throw new ConflictException('User is already invited to this project');
    }

    const user = await this.usersRepository.findOne({
      where: { email: inviteMemberDto.email },
    });

    const projectMember = new ProjectMember();
    projectMember.projectId = projectId;
    projectMember.email = inviteMemberDto.email;
    projectMember.role = inviteMemberDto.role;
    projectMember.status = ProjectMemberStatus.PENDING;
    if (user) {
      projectMember.user = user;
      projectMember.userId = user.id;
    }

    const savedMember = await this.projectMembersRepository.save(projectMember);

    if (user) {
      await this.mailService.sendProjectInvitation(
        user,
        project,
        currentUser,
        savedMember,
      );
    } else {
      await this.mailService.sendProjectInvitationToNewUser(
        inviteMemberDto.email,
        project,
        currentUser,
        savedMember,
      );
    }

    return savedMember;
  }

  async acceptInvitation(
    projectId: string,
    memberId: string,
    user: User,
  ): Promise<ProjectMember> {
    const projectMember = await this.projectMembersRepository.findOne({
      where: { id: memberId, projectId },
    });

    if (!projectMember) {
      throw new NotFoundException('Invitation not found');
    }

    if (projectMember.email !== user.email) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (projectMember.status !== ProjectMemberStatus.PENDING) {
      throw new ConflictException('Invitation has already been processed');
    }

    projectMember.status = ProjectMemberStatus.ACCEPTED;
    projectMember.user = user;
    projectMember.userId = user.id;
    projectMember.joinedAt = new Date();

    return this.projectMembersRepository.save(projectMember);
  }

  async declineInvitation(
    projectId: string,
    memberId: string,
    user: User,
  ): Promise<ProjectMember> {
    const projectMember = await this.projectMembersRepository.findOne({
      where: { id: memberId, projectId },
    });

    if (!projectMember) {
      throw new NotFoundException('Invitation not found');
    }

    if (projectMember.email !== user.email) {
      throw new ForbiddenException('This invitation is not for you');
    }

    if (projectMember.status !== ProjectMemberStatus.PENDING) {
      throw new ConflictException('Invitation has already been processed');
    }

    projectMember.status = ProjectMemberStatus.DECLINED;
    return this.projectMembersRepository.save(projectMember);
  }

  async cancelInvitation(
    projectId: string,
    memberId: string,
    currentUser: User,
  ): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== currentUser.id) {
      throw new ForbiddenException('Only project owner can cancel invitations');
    }

    const projectMember = await this.projectMembersRepository.findOne({
      where: { id: memberId, projectId },
    });

    if (!projectMember) {
      throw new NotFoundException('Invitation not found');
    }

    if (projectMember.status !== ProjectMemberStatus.PENDING) {
      throw new ConflictException('Cannot cancel processed invitation');
    }

    await this.projectMembersRepository.remove(projectMember);
  }

  async getProjectMembers(projectId: string): Promise<ProjectMember[]> {
    return this.projectMembersRepository.find({
      where: { projectId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async removeMember(
    projectId: string,
    memberId: string,
    currentUser: User,
  ): Promise<void> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== currentUser.id) {
      throw new ForbiddenException('Only project owner can remove members');
    }

    const projectMember = await this.projectMembersRepository.findOne({
      where: { id: memberId, projectId },
    });

    if (!projectMember) {
      throw new NotFoundException('Project member not found');
    }

    await this.projectMembersRepository.remove(projectMember);
  }

  async updateMemberRole(
    projectId: string,
    memberId: string,
    role: ProjectMemberRole,
    currentUser: User,
  ): Promise<ProjectMember> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.ownerId !== currentUser.id) {
      throw new ForbiddenException(
        'Only project owner can update member roles',
      );
    }

    const projectMember = await this.projectMembersRepository.findOne({
      where: { id: memberId, projectId },
    });

    if (!projectMember) {
      throw new NotFoundException('Project member not found');
    }

    projectMember.role = role;
    return this.projectMembersRepository.save(projectMember);
  }
}
