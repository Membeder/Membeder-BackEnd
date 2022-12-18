import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contest } from './entities/contest.entity';
import { FindContestDto } from './dto/find-contest.dto';

@Injectable()
export class ContestService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepository: Repository<Contest>,
  ) {}

  async find({ sort, page, count }: FindContestDto): Promise<Contest[]> {
    return await this.contestRepository.find({
      order: { receipt: sort },
      skip: (page - 1) * count,
      take: count,
    });
  }
}
