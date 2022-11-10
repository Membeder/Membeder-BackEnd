import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, MoreThanOrEqual, Repository } from 'typeorm';
import { Team } from './entites/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamDto } from './dto/find-team.dto';
import { User } from '../user/entities/user.entity';
import { TeamApplicantService } from './team-applicant.service';
import { TeamPermissionService } from './team-permission.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamApplicantService: TeamApplicantService,
    private readonly teamPermissionService: TeamPermissionService,
  ) {}

  async find(option: FindTeamDto): Promise<Team[]> {
    const { id, name, page, count, sort, applicant } = option;
    return await this.teamRepository.find({
      order: { created: sort },
      where: {
        id,
        name,
        applicant: {
          developer: applicant == 'developer' ? MoreThanOrEqual(1) : undefined,
          designer: applicant == 'designer' ? MoreThanOrEqual(1) : undefined,
          director: applicant == 'director' ? MoreThanOrEqual(1) : undefined,
        },
      },
      skip: (page - 1) * count,
      take: count,
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
        'schedule',
        'join_request',
      ],
    });
  }

  async findById(id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id },
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
        'schedule',
        'join_request',
      ],
    });
    if (team) return team;
    else
      throw new HttpException(
        'Team information not found.',
        HttpStatus.BAD_REQUEST,
      );
  }

  async create(data: CreateTeamDto, id: string): Promise<Team> {
    const existName = await this.find({ name: data.name });
    if (existName.length > 0)
      throw new HttpException(
        'Team Name is already exist.',
        HttpStatus.BAD_REQUEST,
      );
    const owner = await this.userRepository.findOne({
      where: { id },
      relations: ['team'],
    });
    const applicant = await this.teamApplicantService.create(data.applicant);
    const newTeam = this.teamRepository.create({
      ...data,
      owner,
      member: [owner],
      permission: await this.teamPermissionService.create(),
      applicant,
      schedule: [],
    });
    await this.teamRepository.save(newTeam);
    owner.team.push(await this.findById(newTeam.id));
    await this.userRepository.save(owner);
    return this.findById(newTeam.id);
  }

  async update(id: string, data: DeepPartial<Team>): Promise<Team> {
    if (data.applicant) {
      const team = await this.findById(id);
      await this.teamApplicantService.update(team.applicant.id, data.applicant);
    }
    await this.teamRepository.update(id, {
      ...data,
      applicant: undefined,
    });
    return await this.findById(id);
  }

  async remove(id: string, user: User): Promise<Team> {
    const team = await this.findById(id);
    const applicant_id = team.applicant.id;
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    if (!team.member.find((e) => e.id == user.id))
      throw new HttpException(
        'You are not team member.',
        HttpStatus.BAD_REQUEST,
      );
    if (team.owner.id != user.id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    await this.teamRepository.delete({ id });
    await this.teamApplicantService.remove(applicant_id);
    return team;
  }

  async addUser(
    team_id: string,
    user_id: string,
    now_user_id: string,
  ): Promise<Team> {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['team'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (team.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is already exist in this team.',
        HttpStatus.BAD_REQUEST,
      );
    if (team.owner.id != now_user_id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    if (team.join_request.find((e) => e.id == user_id))
      team.join_request.splice(
        team.join_request.findIndex((e) => e.id == user.id),
        1,
      );
    team.member.push(user);
    await this.teamRepository.save(team);
    user.team.push(await this.findById(team.id));
    await this.userRepository.save(user);
    return this.findById(team.id);
  }

  async removeUser(team_id: string, user_id: string, now_user_id: string) {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['team'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!team.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is not exist in this team.',
        HttpStatus.BAD_REQUEST,
      );
    if (team.owner.id != now_user_id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    team.member.splice(
      team.member.findIndex((e) => e.id == user.id),
      1,
    );
    await this.teamRepository.save(team);
    user.team.splice(
      user.team.findIndex((e) => e.id == team.id),
      1,
    );
    await this.userRepository.save(user);
    return this.findById(team.id);
  }

  async addJoinRequest(team_id: string, user_id: string): Promise<Team> {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['team'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (team.member.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is already exist in this team.',
        HttpStatus.BAD_REQUEST,
      );
    if (team.join_request.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is already exist in this team request.',
        HttpStatus.BAD_REQUEST,
      );
    team.join_request.push(user);
    await this.teamRepository.save(team);
    return this.findById(team.id);
  }

  async removeJoinRequest(team_id: string, user_id: string): Promise<Team> {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['team'],
    });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!team.join_request.find((e) => e.id == user_id))
      throw new HttpException(
        'The user is not exist in this team request.',
        HttpStatus.BAD_REQUEST,
      );
    team.join_request.splice(
      team.join_request.findIndex((e) => e.id == user.id),
      1,
    );
    await this.teamRepository.save(team);
    return this.findById(team.id);
  }

  // async addJoinRequest(team_id: string, user_id: string): Promise<Team> {}

  // async removeJoinRequest(team_id: string, user_id: string): Promise<Team> {}
}
