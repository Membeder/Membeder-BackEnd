import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleVerifyDto {
  @ApiProperty({ description: 'Google ID Token' })
  @IsString()
  idToken: string;
}
