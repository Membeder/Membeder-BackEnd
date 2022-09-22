import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  nickname: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 200, nullable: true, select: false })
  refreshToken: string;

  @Column({ nullable: false })
  profession: string;

  @Column({ nullable: false })
  career: number;

  @Column({ nullable: false })
  gender: 'male' | 'female';

  @Column({ default: '' })
  website: string;

  @Column({ default: '' })
  introduce: string;

  @Column({ default: '' })
  stack: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
