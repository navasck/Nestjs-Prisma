import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTeamDTO } from './dto/create-team.dto';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { SendInviteDTO } from './dto/send-invite-dto';
import { UpdateRoleDTO } from './dto/update-role-dto';
import { Public } from '@common/decorators/public.decorator';
import { AcceptInviteDTO } from './dto/accept-invite-dto';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamService: TeamsService) {}

  @Roles(Role.ADMIN)
  @Post()
  createTeam(@Body() createTeamDto: CreateTeamDTO, @Req() req: any) {
    // req.user attached from jwt.strategy.ts
    const userId = req.user?.id;
    console.log('User from request:', req.user);
    return this.teamService.createTeam(createTeamDto, userId);
  }

  @Roles(Role.ADMIN)
  @Post('send-invite')
  async sendInvite(@Body() inviteDTO: SendInviteDTO, @Req() req: any) {
    return this.teamService.sendInvite({ ...inviteDTO, inviterId: req.user.id });
  }

  @Get('accept-invite')
  @Public()
  async acceptInvite(@Query() acceptInvite: AcceptInviteDTO) {
    return this.teamService.acceptInvite(acceptInvite);
  }

  @Roles(Role.ADMIN)
  @Patch(':teamId/members/:memberId/role')
  async updateRole(
    @Body() updateRoleDTO: UpdateRoleDTO,
    @Param('memberId') memberId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.teamService.updateRole(updateRoleDTO, memberId, teamId);
  }
}
