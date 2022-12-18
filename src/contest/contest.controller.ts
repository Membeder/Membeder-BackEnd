import { Controller, Get, Query } from '@nestjs/common';
import { ContestService } from './contest.service';
import { FindContestDto } from './dto/find-contest.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetContestDto } from './dto/get-contest.dto';

@ApiTags('Contest')
@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Get('')
  @ApiOperation({
    summary: '대회 리스트 가져오기',
    description: '대회 리스트를 가져옵니다.',
  })
  @ApiOkResponse({
    description: '대회 리스트를 가져옵니다.',
    type: () => GetContestDto,
  })
  async find(@Query() data: FindContestDto) {
    const result = await this.contestService.find(data);
    return result.map((e) => {
      return { ...e, target: JSON.parse(e.target) };
    });
  }
}
