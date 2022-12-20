import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamNotice } from './entites/team-notice.entity';
import { Repository } from 'typeorm';
import { Team } from './entites/team.entity';
import { CreateTeamNoticeDto } from './dto/create-team-notice.dto';
import { UpdateTeamNoticeDto } from './dto/update-team-notice.dto';

@Injectable()
export class TeamNoticeService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamNotice)
    private readonly teamNoticeRepository: Repository<TeamNotice>,
  ) {}

  async get(team_id: string, notice_id: string) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'notice'],
    });
    if (!team)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    const notice = await this.teamNoticeRepository.findOne({
      where: { id: notice_id },
    });
    if (!notice)
      throw new HttpException(
        'The notice is not exist.',
        HttpStatus.BAD_REQUEST,
      );
    return notice;
  }

  async create(team_id: string, user_id: string, data: CreateTeamNoticeDto) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'notice'],
    });
    if (!team)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (team.owner.id != user_id)
      throw new HttpException(
        'The user is not team owner.',
        HttpStatus.FORBIDDEN,
      );
    const notice = await this.teamNoticeRepository.create(data);
    await this.teamNoticeRepository.save(notice);
    team.notice.push(notice);
    await this.teamRepository.save(team);
    return notice;
  }

  async update(
    team_id: string,
    notice_id: string,
    user_id: string,
    data: UpdateTeamNoticeDto,
  ) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'notice'],
    });
    if (!team)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (team.owner.id != user_id)
      throw new HttpException(
        'The user is not team owner.',
        HttpStatus.FORBIDDEN,
      );
    const notice = await this.teamNoticeRepository.findOne({
      where: { id: notice_id },
    });
    if (!notice)
      throw new HttpException(
        'The notice is not exist.',
        HttpStatus.BAD_REQUEST,
      );
    await this.teamNoticeRepository.update({ id: notice_id }, { ...data });
    return await this.teamNoticeRepository.findOne({
      where: { id: notice_id },
    });
  }

  async remove(team_id: string, notice_id: string, user_id: string) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'notice'],
    });
    if (!team)
      throw new HttpException('The room is not exist.', HttpStatus.BAD_REQUEST);
    if (team.owner.id != user_id)
      throw new HttpException(
        'The user is not team owner.',
        HttpStatus.FORBIDDEN,
      );
    if (!team.notice.find((e) => e.id == notice_id))
      throw new HttpException(
        'The notice is not exist.',
        HttpStatus.BAD_REQUEST,
      );
    team.notice.splice(
      team.notice.findIndex((e) => e.id == notice_id),
      1,
    );
    await this.teamRepository.save(team);
    await this.teamNoticeRepository.delete({ id: notice_id });
  }
}
