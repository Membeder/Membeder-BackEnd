import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TeamPermission } from '../team/entites/team-permission.entity';
import { Team } from '../team/entites/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Team, TeamPermission])],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService],
})
export class ScheduleModule {}
