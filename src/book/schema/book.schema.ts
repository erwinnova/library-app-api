import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Book {
  @Prop({ unique: true })
  code: string;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop({ min: 0 })
  stock: number;

  @Prop({ default: 0, min: 0 })
  borrowed: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
