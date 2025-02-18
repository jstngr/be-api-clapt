import {
  Controller,
  Post,
  Get,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProjectMembersService } from './project-members.service';
import { JwtAuthGuard } from '../auth/guards';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import {
  ProjectMember,
  ProjectMemberRole,
} from './entities/project-member.entity';

@ApiTags('Project Members')
@ApiBearerAuth()
@Controller('projects/:projectId/members')
@UseGuards(JwtAuthGuard)
export class ProjectMembersController {
  constructor(private readonly projectMembersService: ProjectMembersService) {}

  @Post()
  @ApiOperation({ summary: 'Invite a new member to the project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiBody({ type: InviteMemberDto })
  @ApiResponse({
    status: 201,
    description: 'Member has been successfully invited',
    type: ProjectMember,
  })
  @ApiResponse({
    status: 403,
    description: 'Only project owner can invite members',
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  @ApiResponse({
    status: 409,
    description: 'User is already invited to this project',
  })
  inviteMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() inviteMemberDto: InviteMemberDto,
    @GetUser() user: User,
  ): Promise<ProjectMember> {
    return this.projectMembersService.inviteMember(
      projectId,
      inviteMemberDto,
      user,
    );
  }

  @Post(':memberId/accept')
  @ApiOperation({ summary: 'Accept a project invitation' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiParam({
    name: 'memberId',
    description: 'The ID of the project member invitation',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
    type: ProjectMember,
  })
  @ApiResponse({ status: 403, description: 'This invitation is not for you' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({
    status: 409,
    description: 'Invitation has already been processed',
  })
  acceptInvitation(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @GetUser() user: User,
  ): Promise<ProjectMember> {
    return this.projectMembersService.acceptInvitation(
      projectId,
      memberId,
      user,
    );
  }

  @Post(':memberId/decline')
  @ApiOperation({ summary: 'Decline a project invitation' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiParam({
    name: 'memberId',
    description: 'The ID of the project member invitation',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation declined successfully',
    type: ProjectMember,
  })
  @ApiResponse({ status: 403, description: 'This invitation is not for you' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  @ApiResponse({
    status: 409,
    description: 'Invitation has already been processed',
  })
  declineInvitation(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @GetUser() user: User,
  ): Promise<ProjectMember> {
    return this.projectMembersService.declineInvitation(
      projectId,
      memberId,
      user,
    );
  }

  @Delete(':memberId/cancel')
  @ApiOperation({ summary: 'Cancel a pending project invitation' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiParam({
    name: 'memberId',
    description: 'The ID of the project member invitation',
  })
  @ApiResponse({
    status: 200,
    description: 'Invitation cancelled successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only project owner can cancel invitations',
  })
  @ApiResponse({ status: 404, description: 'Project or invitation not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot cancel processed invitation',
  })
  cancelInvitation(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.projectMembersService.cancelInvitation(
      projectId,
      memberId,
      user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all members of a project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiResponse({
    status: 200,
    description: 'List of project members',
    type: [ProjectMember],
  })
  @ApiResponse({ status: 404, description: 'Project not found' })
  getProjectMembers(
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ): Promise<ProjectMember[]> {
    return this.projectMembersService.getProjectMembers(projectId);
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from the project' })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiParam({ name: 'memberId', description: 'The ID of the project member' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({
    status: 403,
    description: 'Only project owner can remove members',
  })
  @ApiResponse({ status: 404, description: 'Project or member not found' })
  removeMember(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.projectMembersService.removeMember(projectId, memberId, user);
  }

  @Put(':memberId/role')
  @ApiOperation({ summary: "Update a member's role in the project" })
  @ApiParam({ name: 'projectId', description: 'The ID of the project' })
  @ApiParam({ name: 'memberId', description: 'The ID of the project member' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: {
          type: 'string',
          enum: Object.values(ProjectMemberRole),
          description: 'The new role for the member',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Member role updated successfully',
    type: ProjectMember,
  })
  @ApiResponse({
    status: 403,
    description: 'Only project owner can update member roles',
  })
  @ApiResponse({ status: 404, description: 'Project or member not found' })
  updateMemberRole(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body('role') role: ProjectMemberRole,
    @GetUser() user: User,
  ): Promise<ProjectMember> {
    return this.projectMembersService.updateMemberRole(
      projectId,
      memberId,
      role,
      user,
    );
  }
}
