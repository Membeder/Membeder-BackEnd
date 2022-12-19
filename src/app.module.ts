import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { GoogleModule } from './google/google.module';
import { TeamModule } from './team/team.module';
import { ScheduleModule } from './schedule/schedule.module';
import { FileModule } from './file/file.module';
import { ContestModule } from './contest/contest.module';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TeamModule,
    GoogleModule,
    ScheduleModule,
    // FileModule,
    ContestModule,
    PortfolioModule,
  ],
})
export class AppModule {}
