import { PartialType } from '@nestjs/swagger';
import { CreateTeamNoticeDto } from './create-team-notice.dto';

export class UpdateTeamNoticeDto extends PartialType(CreateTeamNoticeDto) {}
