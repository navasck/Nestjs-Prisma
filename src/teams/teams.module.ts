import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from '@common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
