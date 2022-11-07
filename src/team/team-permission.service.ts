import { InjectRepository } from '@nestjs/typeorm';
import { TeamPermission } from './entites/team-permission.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Team } from './entites/team.entity';

@Injectable()
export class TeamPermissionService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(TeamPermission)
    private readonly teamPermissionRepository: Repository<TeamPermission>,
    private readonly userService: UserService,
  ) {}

  async create(): Promise<TeamPermission> {
    const permission = await this.teamPermissionRepository.create();
    return await this.teamPermissionRepository.save(permission);
  }

  async findById(id: string): Promise<TeamPermission> {
    return await this.teamPermissionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async addUser(
    team_id: string,
    user_id: string,
    now_user_id: string,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
      ],
    });
    const user = await this.userService.findById(user_id);
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (team.owner.id != now_user_id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    if (now_user_id == user_id)
      throw new HttpException(
        'You cannot add yourself.',
        HttpStatus.BAD_REQUEST,
      );
    if (!team.member.find((e) => e.id == user.id))
      throw new HttpException(
        'This user does not exist on this team.',
        HttpStatus.BAD_REQUEST,
      );
    if (team.permission.user.find((e) => e.id == user.id))
      throw new HttpException(
        'This user already has permission.',
        HttpStatus.BAD_REQUEST,
      );
    const permission = await this.findById(team.permission.id);
    permission.user.push(user);
    await this.teamPermissionRepository.save(permission);
    return await this.teamRepository.findOne({
      where: { id: team_id },
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
      ],
    });
  }

  async removeUser(
    team_id: string,
    user_id: string,
    now_user_id: string,
  ): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: team_id },
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
      ],
    });
    const user = await this.userService.findById(user_id);
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!team)
      throw new HttpException('Team is not exist', HttpStatus.BAD_REQUEST);
    if (team.owner.id != now_user_id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    if (now_user_id == user_id)
      throw new HttpException(
        'You cannot add yourself.',
        HttpStatus.BAD_REQUEST,
      );
    if (!team.member.find((e) => e.id == user.id))
      throw new HttpException(
        'This user does not exist on this team.',
        HttpStatus.BAD_REQUEST,
      );
    if (!team.permission.user.find((e) => e.id == user.id))
      throw new HttpException(
        "This user hasn't permission.",
        HttpStatus.BAD_REQUEST,
      );
    const permission = await this.findById(team.permission.id);
    permission.user.splice(
      permission.user.findIndex((e) => e.id == user.id),
      1,
    );
    await this.teamPermissionRepository.save(permission);
    return await this.teamRepository.findOne({
      where: { id: team_id },
      relations: [
        'owner',
        'member',
        'applicant',
        'permission',
        'permission.user',
      ],
    });
  }
}
