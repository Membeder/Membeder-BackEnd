import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('contest')
export class Contest {
  @ApiProperty({ description: 'UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '이름' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ description: '주최' })
  @Column({ nullable: false })
  host: string;

  @ApiProperty({ description: '대상' })
  @Column({ nullable: false })
  target: string;

  @ApiProperty({ description: '접수 마감일' })
  @Column({ nullable: false })
  receipt: Date;

  @ApiProperty({ description: '심사 마감일' })
  @Column({ nullable: false })
  judge: Date;

  @ApiProperty({ description: '자세한 정보' })
  @Column({ nullable: false })
  content: string;
}
