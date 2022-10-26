import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Team } from './entites/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { FindTeamDto } from './dto/find-team.dto';
import { User } from '../user/entities/user.entity';
import { TeamApplicantService } from './team-applicant.service';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly teamApplicantService: TeamApplicantService,
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
      (async () => {
        e.applicant = {
          ...(await e.applicant),
          id: undefined,
          created: undefined,
          updated: undefined,
        };
      })();
      // Remove Unused Value
      e.__owner__ =
        e.__member__ =
        e.__has_owner__ =
        e.__has_member__ =
        e.__applicant__ =
        e.__has_applicant__ =
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
        'Team Name is already exist.',
        HttpStatus.BAD_REQUEST,
      );

    // Load User and Team
    const owner = await this.userRepository.findOne({ where: { id } });
    const newTeam = this.teamRepository.create({
      ...data,
      applicant: null,
    });

    // Create Team Applicant
    const applicant = await this.teamApplicantService.create(data.applicant);

    // Set Team Relation
    newTeam.applicant = Promise.resolve(applicant);
    newTeam.owner = Promise.resolve(owner);
    (await newTeam.member).push(owner);
    await this.teamRepository.save(newTeam);

    //Set User Relation
    (await owner.team).push(await this.findById(newTeam.id));
    await this.userRepository.save(owner);

    return {
      ...newTeam,
      applicant: {
        ...(await newTeam.applicant),
        id: undefined,
        created: undefined,
        updated: undefined,
      },
      owner: {
        ...(await newTeam.owner),
        // Remove Password & Unused Value
        password: undefined,
        __team__: undefined,
        __has_team__: undefined,
      },
      member: (await newTeam.member).map((e: any) => {
        // Remove Password & Unused Value
        e.password = e.__team__ = e.__has_team__ = undefined;
        return e;
      }),
      // Remove Unused Value
      __owner__: undefined,
      __member__: undefined,
      __applicant__: undefined,
      __has_owner__: undefined,
      __has_member__: undefined,
      __has_applicant__: undefined,
    };
  }

  async update(id: string, data: DeepPartial<Team>): Promise<UpdateResult> {
    return await this.teamRepository.update(id, data);
  }

  async remove(id: string, user: User): Promise<DeleteResult> {
    const team = await this.findById(id);
    const applicant_id = (await team.applicant).id;
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    if (!(await team.member).find((e) => e.id == user.id))
      throw new HttpException(
        'You are not team member.',
        HttpStatus.BAD_REQUEST,
      );
    if ((await team.owner).id != user.id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    const result = await this.teamRepository.delete({ id });
    await this.teamApplicantService.remove(applicant_id);
    return result;
  }

  async addUser(team_id: string, user_id: string, now_user: User) {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if ((await team.member).find((e) => e.id == user_id))
      throw new HttpException(
        'The user is already exist in this team.',
        HttpStatus.BAD_REQUEST,
      );
    if ((await team.owner).id != now_user.id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    (await team.member).push(user);
    await this.teamRepository.save(team);
    (await user.team).push(await this.findById(team.id));
    await this.userRepository.save(user);
    return {
      ...team,
      applicant: {
        ...(await team.applicant),
        id: undefined,
        created: undefined,
        updated: undefined,
      },
      owner: {
        ...(await team.owner),
        // Remove Password & Unused Value
        password: undefined,
        __team__: undefined,
        __has_team__: undefined,
      },
      member: (await team.member).map((e: any) => {
        // Remove Password & Unused Value
        e.password = e.__team__ = e.__has_team__ = undefined;
        return e;
      }),
      // Remove Unused Value
      __owner__: undefined,
      __member__: undefined,
      __applicant__: undefined,
      __has_owner__: undefined,
      __has_member__: undefined,
      __has_applicant__: undefined,
    };
  }

  async removeUser(team_id: string, user_id: string, now_user: User) {
    const team = await this.findById(team_id);
    if (!team)
      throw new HttpException(
        'The team does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    if (!(await team.member).find((e) => e.id == user_id))
      throw new HttpException(
        'The user is not exist in this team.',
        HttpStatus.BAD_REQUEST,
      );
    if ((await team.owner).id != now_user.id)
      throw new HttpException('You are not team owner.', HttpStatus.FORBIDDEN);
    (await team.member).splice(
      (await team.member).findIndex((e) => e.id == user.id),
      1,
    );
    await this.teamRepository.save(team);
    (await user.team).splice(
      (await user.team).findIndex((e) => e.id == team.id),
      1,
    );
    await this.userRepository.save(user);
    return {
      ...team,
      applicant: {
        ...(await team.applicant),
        id: undefined,
        created: undefined,
        updated: undefined,
      },
      owner: {
        ...(await team.owner),
        // Remove Password & Unused Value
        password: undefined,
        __team__: undefined,
        __has_team__: undefined,
      },
      member: (await team.member).map((e: any) => {
        // Remove Password & Unused Value
        e.password = e.__team__ = e.__has_team__ = undefined;
        return e;
      }),
      // Remove Unused Value
      __owner__: undefined,
      __member__: undefined,
      __applicant__: undefined,
      __has_owner__: undefined,
      __has_member__: undefined,
      __has_applicant__: undefined,
    };
  }
}
