import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BorrowBooksDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ApiProperty()
  book_codes: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  member_code: string;
}
