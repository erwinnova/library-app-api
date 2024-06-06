import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateBookDto {
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
}
