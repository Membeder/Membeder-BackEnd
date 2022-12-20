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
import { TeamApplicantController } from './team-applicant.controller';
import { TeamNoticeService } from './team-notice.service';
import { TeamNoticeController } from './team-notice.controller';
import { TeamNotice } from './entites/team-notice.entity';
import { ChatRoom } from '../chat/entities/chat-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Team,
      TeamApplicant,
      TeamPermission,
      TeamNotice,
      ChatRoom,
    ]),
    UserModule,
  ],
  controllers: [
    TeamApplicantController,
    TeamPermissionController,
    TeamNoticeController,
    TeamController,
  ],
  providers: [
    TeamService,
    TeamApplicantService,
    TeamPermissionService,
    TeamNoticeService,
  ],
  exports: [
    TeamService,
    TeamApplicantService,
    TeamPermissionService,
    TeamNoticeService,
  ],
})
export class TeamModule {}
