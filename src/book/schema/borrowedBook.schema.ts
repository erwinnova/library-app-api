import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class BorrowedBook {
  @Prop()
  code: string;

  @Prop()
  title: string;

  @Prop()
  borrowing_datetime: Date;

  @Prop()
  designated_returning_datetime: Date;

  @Prop()
  actual_returning_datetime: Date;
}

export const BorrowedBookSchema = SchemaFactory.createForClass(BorrowedBook);
