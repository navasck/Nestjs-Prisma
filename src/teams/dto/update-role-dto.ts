import { TeamRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRoleDTO {
  @IsEnum(TeamRole)
  role: TeamRole;
}
