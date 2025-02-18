import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    return this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        owner: {
          connect: { id: user.id }
        },
        members: {
          create: {
            email: createProjectDto.ownerEmail,
            userId: user.id,
            role: 'OWNER',
            status: 'ACCEPTED',
          }
        }
      },
      include: {
        owner: true,
        members: true
      }
    });
  }

  async findAll(user: User) {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            members: {
              some: {
                userId: user.id
              }
            }
          }
        ]
      },
      include: {
        owner: true,
        members: true
      }
    });
  }

  async findOne(id: string, user: User) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        members: true
      }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const isMember = project.members.some((member) => member.userId === user.id);
    if (project.ownerId !== user.id && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(id: string, updateData: Partial<CreateProjectDto>, user: User) {
    await this.checkProjectAccess(id, user);

    return this.prisma.project.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description
      },
      include: {
        owner: true,
        members: true
      }
    });
  }

  async delete(id: string, user: User): Promise<void> {
    await this.checkProjectAccess(id, user);
    await this.prisma.project.delete({ where: { id } });
  }

  async deactivate(id: string, user: User) {
    await this.checkProjectAccess(id, user);
    
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        owner: true,
        members: true
      }
    });
  }

  private async checkProjectAccess(id: string, user: User): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const isMember = project.members.some((member) => member.userId === user.id);
    if (project.ownerId !== user.id && !isMember) {
      throw new ForbiddenException('You do not have access to this project');
    }
  }
}
