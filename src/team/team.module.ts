import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entites/team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';
import { TeamApplicant } from './entites/team-applicant.entity';
import { TeamApplicantService } from './team-applicant.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Team, TeamApplicant]), UserModule],
  controllers: [TeamController],
  providers: [TeamService, TeamApplicantService],
  exports: [TeamService, TeamApplicantService],
})
export class TeamModule {}
