import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetPortfolioDto } from './dto/get-portfolio.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('/:user_id')
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiOperation({
    summary: '포트폴리오 리스트',
    description: '유저의 포트폴리오 리스트를 조회합니다.',
  })
  @ApiOkResponse({
    description: '포트폴리오 리스트가 성공적으로 조회되었습니다.',
    type: [GetPortfolioDto],
  })
  @ApiBadRequestResponse({
    description: '유저가 없을 경우 발생합니다.',
  })
  async list(@Param('user_id') user_id: string) {
    return await this.portfolioService.list(user_id);
  }

  @Get('/:user_id/:portfolio_id')
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiOperation({
    summary: '포트폴리오 조회',
    description: '유저의 포트폴리오를 조회합니다.',
  })
  @ApiOkResponse({
    description: '포트폴리오가 성공적으로 조회되었습니다.',
    type: [GetPortfolioDto],
  })
  @ApiBadRequestResponse({
    description: '유저가 없거나 포트폴리오가 없을 경우 발생합니다.',
  })
  async find(
    @Param('user_id') user_id: string,
    @Param('portfolio_id') portfolio_id: string,
  ) {
    return await this.portfolioService.find(user_id, portfolio_id);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '파일 업로드',
    description: '포트폴리오 파일을 업로드합니다.',
  })
  @ApiOkResponse({
    description: '포트폴리오가 성공적으로 업로드 되었습니다.',
    type: GetPortfolioDto,
  })
  @ApiBadRequestResponse({ description: '파일이 존재하지 않을 때 발생합니다.' })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiCookieAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.MulterS3.File, @Req() req) {
    return this.portfolioService.upload(req.user.id, file);
  }

  @Delete('/:user_id/:portfolio_id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'user_id', required: true, description: '유저 UUID' })
  @ApiParam({
    name: 'portfolio_id',
    required: true,
    description: '포트폴리오 UUID',
  })
  @ApiOperation({
    summary: '파일 제거',
    description: '포트폴리오 파일을 제거합니다.',
  })
  @ApiOkResponse({ description: '포트폴리오가 성공적으로 제거되었습니다.' })
  @ApiBadRequestResponse({
    description: '포트폴리오가 존재하지 않을 때 발생합니다.',
  })
  @ApiUnauthorizedResponse({
    description: '로그인이 되어있지 않은 경우 발생합니다.',
  })
  @ApiForbiddenResponse({
    description: '유저가 만든 포트폴리오가 아닌 경우 발생합니다.',
  })
  @ApiCookieAuth()
  async remove(
    @Param('user_id') user_id: string,
    @Param('portfolio_id') portfolio_id: string,
    @Req() req,
    @Res() res,
  ) {
    await this.portfolioService.remove(user_id, portfolio_id);
    res.sendStatus(200);
  }
}
