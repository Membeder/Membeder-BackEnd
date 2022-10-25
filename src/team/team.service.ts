import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Team } from './entites/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamDto } from './dto/find-team.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async find(option: FindTeamDto): Promise<Team[]> {
    const { id, name, page = 1, count = 5, sort = 'ASC' } = option;
    const result = await this.teamRepository.find({
      order: { created: sort },
      where: { id, name },
      skip: (page - 1) * count,
      take: count,
    });
    return result.map((e: any) => {
      e.__owner__ =
        e.__member__ =
        e.__has_owner__ =
        e.__has_member__ =
          undefined;
      return e;
    });
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
    });
    if (team) return team;
    else
      throw new HttpException(
        'Team information not found.',
        HttpStatus.BAD_REQUEST,
      );
  }

  async create(data: CreateTeamDto, id: string) {
    const existName = await this.find({ name: data.name });
    if (existName.length > 0)
      throw new HttpException(
        'Team Name is already exist',
        HttpStatus.BAD_REQUEST,
      );
    const owner = await this.userRepository.findOne({ where: { id } });
    const newTeam = this.teamRepository.create(data);
    newTeam.owner = Promise.resolve(owner);
    (await newTeam.member).push(owner);
    await this.teamRepository.save(newTeam);
    (await owner.team).push(await this.findById(newTeam.id));
    await this.userRepository.save(owner);
    return {
      ...newTeam,
      owner: {
        ...(await newTeam.owner),
        password: undefined,
        __team__: undefined,
        __has_team__: undefined,
      },
      member: (await newTeam.member).map((e: any) => {
        e.password = e.__team__ = e.__has_team__ = undefined;
        return e;
      }),
      __owner__: undefined,
      __member__: undefined,
      __has_owner__: undefined,
      __has_member__: undefined,
    };
  }

  async update(id: string, data: DeepPartial<Team>): Promise<UpdateResult> {
    return await this.teamRepository.update(id, data);
  }

  async remove(id: string, user: User): Promise<DeleteResult> {
    const team = await this.findById(id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const member = await team.member;
    const owner = await team.owner;
    if (!member.find((e) => e.id == user.id))
      throw new HttpException(
        'You are not team member',
        HttpStatus.BAD_REQUEST,
      );
    if (owner.id != user.id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    return await this.teamRepository.delete({ id });
  }
}
