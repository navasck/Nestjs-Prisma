import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('stats')
  @Roles(Role.ADMIN)
  getAdminStats() {
    return {
      userCount: 1500,
      activeProjects: 45,
      systemHealth: 'Good',
    };
  }
}

// @UseGuards
// Decorator that binds guards to the scope of the controller or method, depending on its context.
