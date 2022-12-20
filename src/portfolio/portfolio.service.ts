import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
    private readonly configService: ConfigService,
  ) {}

  async find(user_id: string, portfolio_id: string): Promise<Portfolio> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    const result = await this.portfolioRepository.findOne({
      where: { id: portfolio_id, user: { id: user_id } },
      relations: ['user'],
    });
    if (!result)
      throw new HttpException(
        'The portfolio is not exist.',
        HttpStatus.BAD_REQUEST,
      );
    return result;
  }

  async list(user_id: string): Promise<Portfolio[]> {
    const user = await this.userRepository.findOne({ where: { id: user_id } });
    if (!user)
      throw new HttpException('The user is not exist.', HttpStatus.BAD_REQUEST);
    return await this.portfolioRepository.find({
      where: { user: { id: user_id } },
      relations: ['user'],
    });
  }

  async upload(user_id: string, file: Express.MulterS3.File) {
    if (!file)
      throw new HttpException('The file is not exist.', HttpStatus.BAD_REQUEST);
    const data = await this.portfolioRepository.create({
      user: await this.userRepository.findOne({ where: { id: user_id } }),
      name: file.originalname,
      file: file.location.replace(
        `.${this.configService.get('AWS_S3_NAME')}`,
        '',
      ),
    });
    await this.portfolioRepository.save(data);
    return await this.portfolioRepository.findOne({
      where: { id: data.id },
      relations: ['user'],
    });
  }

  async remove(user_id: string, portfolio_id: string) {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id: portfolio_id },
      relations: ['user'],
    });
    if (!portfolio)
      throw new HttpException(
        'The portfolio does not exist.',
        HttpStatus.BAD_REQUEST,
      );
    if (portfolio.user.id != user_id)
      throw new HttpException(
        'You are not portfolio owner.',
        HttpStatus.FORBIDDEN,
      );
    await this.portfolioRepository.delete({ id: portfolio_id });
  }
}
