import { TeamRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AcceptInviteDTO {
  @IsString()
  token: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsEnum(TeamRole)
  role: TeamRole = TeamRole.MEMBER;
}
