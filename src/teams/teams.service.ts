import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDTO } from './dto/create-team.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { SendInviteDTO } from './dto/send-invite-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';
import { randomBytes } from 'crypto';
import { addHours } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@common/email/email.service';
import { AcceptInviteDTO } from './dto/accept-invite-dto';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private readonly emailService: EmailService,
  ) {} // Assume prisma is properly injected

  updateRole(updateRoleDTO: UpdateRoleDTO, memberId: string, teamId: string) {
    if (!Object.values(Role).includes(updateRoleDTO.role)) {
      throw new BadRequestException('Invalid role');
    }

    const teamMember = this.prisma.teamMember.findFirst({
      where: {
        teamId: teamId,
        userId: memberId,
      },
    });

    if (!teamMember) {
      throw new NotFoundException('Member not found in the team');
    }
    return this.prisma.teamMember.update({
      where: {
        id: memberId,
      },
      data: {
        role: updateRoleDTO.role,
      },
    });
  }
  async createTeam(createTeamDto: CreateTeamDTO, userId: string) {
    console.log('Creating team with data:', createTeamDto, 'for user:', userId);
    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            role: Role.ADMIN, // Assign the creator as ADMIN of the team
          },
        },
      },
      include: {
        members: true,
      },
    });
    return team;
  }

  async sendInvite(sendInviteDTO: SendInviteDTO) {
    const inviter = await this.prisma.teamMember.findFirst({
      where: {
        teamId: sendInviteDTO.teamId,
        userId: sendInviteDTO.inviterId,
      },
    });

    if (!inviter) {
      throw new NotFoundException('Inviter not found in the team');
    }
    if (inviter.role !== Role.ADMIN) {
      throw new BadRequestException('Only team admins can invite members');
    }
    const token = randomBytes(32).toString('hex');

    await this.prisma.teamInvite.create({
      data: {
        teamId: sendInviteDTO.teamId,
        email: sendInviteDTO.email,
        token,
        expiresAt: addHours(new Date(), 24), //valid for 24 hour
      },
    });

    const inviteLink = `${this.configService.get('API_URL')}/teams/accept-invite?token=${token}&userId=${sendInviteDTO.userId}&role=${sendInviteDTO.role}`;

    await this.emailService.sendInvite(sendInviteDTO.email, sendInviteDTO.teamName, inviteLink);

    return { message: 'Invitation Sent' };
  }

  async acceptInvite(acceptInviteDTO: AcceptInviteDTO) {
    const invite = await this.prisma.teamInvite.findUniqueOrThrow({
      where: {
        token: acceptInviteDTO.token,
      },
    });

    if (!invite || invite.status !== 'PENDING') {
      throw new BadRequestException('invalid invite or expired invite');
    }
    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite expired');
    }

    const existingMember = await this.prisma.teamMember.findFirst({
      where: {
        teamId: invite?.teamId,
        userId: acceptInviteDTO.userId,
      },
    });

    if (existingMember) {
      throw new BadRequestException('You are already a member');
    }

    const newMember = await this.prisma.teamMember.create({
      data: {
        teamId: invite.teamId,
        userId: acceptInviteDTO.userId,
        role: acceptInviteDTO.role || Role.MEMBER,
      },
    });

    await this.prisma.teamInvite.update({
      where: { token: acceptInviteDTO.token },
      data: { status: 'ACCEPTED' },
    });
    return newMember;
  }
}
