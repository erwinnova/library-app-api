import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/member.schema';
import { BookModule } from 'src/book/book.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  providers: [MemberService],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
