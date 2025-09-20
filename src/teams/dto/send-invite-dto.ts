import { TeamRole } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';

export class SendInviteDTO {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  teamName: string;

  @IsOptional()
  @IsString()
  inviterId?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsEnum(TeamRole)
  role: TeamRole = TeamRole.MEMBER;
}
