import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Member } from './schema/member.schema';
import { Book } from 'src/book/schema/book.schema';
import { BorrowedBook } from 'src/book/schema/borrowedBook.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name)
    private memberModel: Model<Member>,
  ) {}

  async findAll(query: Query): Promise<Member[]> {
    const resPerPage = Number(query.size) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const members = await this.memberModel
      .find({}, { borrowedBooks: 0 })
      .limit(resPerPage)
      .skip(skip);

    return members;
  }

  async findById(id: string): Promise<Member> {
    return await this.memberModel.findById(id);
  }

  async findByCode(member_code: string): Promise<Member> {
    return await this.memberModel.findOne({ code: member_code });
  }

  async addNewMember(data: Member): Promise<Member> {
    return await this.memberModel.create(data);
  }

  async addBooksToMe(books: BorrowedBook[], member: Member): Promise<Member> {
    return await this.memberModel.findOneAndUpdate(
      { code: member.code },
      {
        $push: { borrowedBooks: { $each: books } },
        $inc: { total_borrowing: +1 },
      },
      { new: true, runValidators: true },
    );
  }

  async resetBorrowedByMemberCode(member: Member): Promise<Member> {
    return await this.memberModel.findOneAndUpdate(
      { code: member.code },
      { borrowedBooks: [] },
      { new: true, runValidators: true },
    );
  }

  async findBorrowedBookByMember(
    member_code: string,
    book_code: string,
  ): Promise<Member> {
    return await this.memberModel.findOne({
      code: member_code,
      borrowedBooks: {
        $elemMatch: {
          code: book_code,
          actual_returning_datetime: null,
        },
      },
    });
  }

  async returnBookToLibrary(
    book_code: string,
    member: Member,
  ): Promise<Member> {
    return await this.memberModel.findOneAndUpdate(
      {
        code: member.code,
        borrowedBooks: {
          $elemMatch: {
            code: book_code,
            actual_returning_datetime: null,
            designated_returning_datetime: { $gte: new Date() },
          },
        },
      },
      {
        $set: {
          'borrowedBooks.$[x].actual_returning_datetime': new Date(),
        },

        $inc: { total_borrowing: -1 },
      },
      {
        arrayFilters: [
          {
            'x.code': book_code,
            'x.actual_returning_datetime': null,
            'x.designated_returning_datetime': { $gte: new Date() },
          },
        ],
        new: true,
        runValidators: true,
      },
    );
  }

  async returnBookToLibraryAndPenalize(
    book_code: string,
    member: Member,
  ): Promise<Member> {
    const today = new Date();
    const nextThreeDays = new Date(today.setDate(today.getDate() + 3));

    return await this.memberModel.findOneAndUpdate(
      {
        code: member.code,
        borrowedBooks: {
          $elemMatch: {
            code: book_code,
            actual_returning_datetime: null,
            designated_returning_datetime: {
              $lt: new Date(),
            },
          },
        },
      },
      {
        $set: {
          'borrowedBooks.$[x].actual_returning_datetime': new Date(),
          is_penalized: true,
          penalty_start_date: new Date(),
          penalty_end_date: nextThreeDays,
        },
        $inc: { total_borrowing: -1 },
      },
      {
        arrayFilters: [
          {
            'x.code': book_code,
            'x.actual_returning_datetime': null,
            'x.designated_returning_datetime': { $gte: new Date() },
          },
        ],
        new: true,
        runValidators: true,
      },
    );
  }
}
