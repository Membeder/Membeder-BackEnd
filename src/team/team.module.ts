import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entites/team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { TeamApplicant } from './entites/team-applicant.entity';
import { TeamApplicantService } from './team-applicant.service';
import { TeamPermission } from './entites/team-permission.entity';
import { TeamPermissionService } from './team-permission.service';
import { TeamPermissionController } from './team-permission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Team, TeamApplicant, TeamPermission]),
    UserModule,
  ],
  controllers: [TeamController, TeamPermissionController],
  providers: [TeamService, TeamApplicantService, TeamPermissionService],
  exports: [TeamService, TeamApplicantService, TeamPermissionService],
})
export class TeamModule {}
