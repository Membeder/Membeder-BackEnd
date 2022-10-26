import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { TeamApplicant } from './entites/team-applicant.entity';
import { TeamApplicantDto } from './dto/team-applicant.dto';

@Injectable()
export class TeamApplicantService {
  constructor(
    @InjectRepository(TeamApplicant)
    private readonly teamApplicantRepository: Repository<TeamApplicant>,
  ) {}

  async findById(id: string): Promise<TeamApplicant> {
    return await this.teamApplicantRepository.findOne({ where: { id } });
  }

  async create(data: DeepPartial<TeamApplicantDto>): Promise<TeamApplicant> {
    const result = this.teamApplicantRepository.create(data);
    return await this.teamApplicantRepository.save(result);
  }

  async update(
    id: string,
    data: DeepPartial<TeamApplicant>,
  ): Promise<UpdateResult> {
    return await this.teamApplicantRepository.update(id, data);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.teamApplicantRepository.delete({ id });
  }
}
