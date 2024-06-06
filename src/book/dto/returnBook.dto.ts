import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class ReturnBooksDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  book_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  member_code: string;
}
