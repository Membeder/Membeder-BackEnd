import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('Team Notice')
@Controller('team/notice')
export class TeamNoticeController {}
