import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { BorrowedBook } from 'src/book/schema/borrowedBook.schema';

export class CreateMemberDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Optional()
  @IsArray()
  borrowedBooks: BorrowedBook[];

  @Optional()
  @IsNumber()
  @Min(0)
  total_borrowing: number;

  @Optional()
  @IsBoolean()
  is_penalized: boolean;

  @Optional()
  @IsDate()
  penalty_start_date: Date;

  @Optional()
  @IsDate()
  penalty_end_date: Date;
}
