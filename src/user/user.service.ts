import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }

  async find(option: FindUserDto): Promise<User[]> {
    const {
      id,
      name,
      nickname,
      email,
      page = 1,
      count = 5,
      sort = 'ASC',
    } = option;
    return await this.userRepository.find({
      order: { created: sort },
      where: { id, name, nickname, email },
      skip: (page - 1) * count,
      take: count,
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['team', 'team.owner', 'team.schedule'],
      select: [
        'id',
        'type',
        'name',
        'nickname',
        'email',
        'birth',
        'picture',
        'profession',
        'career',
        'website',
        'introduce',
        'stack',
        'department',
        'team',
      ],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['team', 'team.owner', 'team.schedule'],
      select: [
        'id',
        'type',
        'name',
        'nickname',
        'email',
        'password',
        'birth',
        'picture',
        'profession',
        'career',
        'website',
        'introduce',
        'stack',
        'department',
      ],
    });
  }

  async update(id: string, data: DeepPartial<User>): Promise<UpdateResult> {
    return await this.userRepository.update({ id }, data);
  }

  async remove(id: string): Promise<DeleteResult> {
    const user = await this.findById(id);
    user.team.forEach((e) => {
      if (e.owner.id == id)
        throw new HttpException(
          'Team owner cannot delete account',
          HttpStatus.BAD_REQUEST,
        );
    });
    return await this.userRepository.delete({ id });
  }
}
