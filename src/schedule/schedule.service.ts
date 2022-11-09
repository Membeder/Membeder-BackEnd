import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Team } from '../team/entites/team.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async get(team_id: string, schedule_id: string): Promise<Schedule> {
    const team = await this.teamRepository.findOne({ where: { id: team_id } });
    const schedule = await this.scheduleRepository.findOne({
      where: { id: schedule_id },
      relations: ['permission', 'permission.user'],
    });
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (!schedule)
      throw new HttpException('Schedule is not exist', HttpStatus.BAD_REQUEST);
    return schedule;
  }

  async create(
    team_id: string,
    data: CreateScheduleDto,
    now_user_id: string,
  ): Promise<Schedule> {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['permission', 'permission.user', 'owner', 'schedule'],
    });
    const schedule = await this.scheduleRepository.findOne({
      where: { name: data.name },
    });
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (
      !team.permission.user.find((e) => e.id == now_user_id) &&
      team.owner.id != now_user_id
    )
      throw new HttpException(
        "You don't have permission.",
        HttpStatus.FORBIDDEN,
      );
    if (schedule)
      throw new HttpException(
        'There is a schedule with the same name.',
        HttpStatus.BAD_REQUEST,
      );
    const newSchedule = await this.scheduleRepository.create({
      ...data,
      permission: team.permission,
    });
    await this.scheduleRepository.save(newSchedule);
    team.schedule.push(newSchedule);
    team.schedule = team.schedule.sort((o1, o2) => {
      return +o1.deadline > +o2.deadline ? 1 : -1;
    });
    await this.teamRepository.save(team);
    return this.scheduleRepository.findOne({
      where: { id: newSchedule.id },
      relations: ['permission', 'permission.user'],
    });
  }

  async update(
    team_id: string,
    schedule_id: string,
    data: UpdateScheduleDto,
    now_user_id: string,
  ): Promise<Schedule> {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'permission', 'permission.user'],
    });
    const schedule = await this.scheduleRepository.findOne({
      where: { id: schedule_id },
    });
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (
      !team.permission.user.find((e) => e.id == now_user_id) &&
      team.owner.id != now_user_id
    )
      throw new HttpException(
        "You don't have permission.",
        HttpStatus.FORBIDDEN,
      );
    if (!schedule)
      throw new HttpException('Schedule is not exist', HttpStatus.BAD_REQUEST);
    await this.scheduleRepository.update({ id: schedule_id }, data);
    return await this.scheduleRepository.findOne({
      where: { id: schedule_id },
      relations: ['permission', 'permission.user'],
    });
  }

  async remove(team_id: string, schedule_id: string, now_user_id: string) {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: ['owner', 'permission', 'permission.user'],
    });
    const schedule = await this.scheduleRepository.findOne({
      where: { id: schedule_id },
    });
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (
      !team.permission.user.find((e) => e.id == now_user_id) &&
      team.owner.id != now_user_id
    )
      throw new HttpException(
        "You don't have permission.",
        HttpStatus.FORBIDDEN,
      );
    if (!schedule)
      throw new HttpException('Schedule is not exist', HttpStatus.BAD_REQUEST);
    await this.scheduleRepository.delete({ id: schedule_id });
  }
}
