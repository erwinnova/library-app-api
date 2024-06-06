import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BorrowedBook } from '../../book/schema/borrowedBook.schema';

@Schema({
  timestamps: true,
})
export class Member {
  @Prop({ unique: true })
  code: string;

  @Prop()
  name: string;

  @Prop()
  borrowedBooks: BorrowedBook[];

  @Prop({ default: 0, min: 0 })
  total_borrowing: number;

  @Prop({ default: false })
  is_penalized: boolean;

  @Prop({ default: null })
  penalty_start_date: Date;

  @Prop({ default: null })
  penalty_end_date: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
