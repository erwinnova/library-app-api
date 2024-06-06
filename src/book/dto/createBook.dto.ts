import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  author: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  stock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  borrowed: 0;
}
