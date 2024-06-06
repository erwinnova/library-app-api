import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { Book } from './schema/book.schema';
import { BorrowBooksDto } from './dto/borrowBook.dto';
import { MemberService } from 'src/member/member.service';
import { Member } from 'src/member/schema/member.schema';
import { BorrowedBook } from './schema/borrowedBook.schema';
import { ReturnBooksDto } from './dto/returnBook.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
    private memberService: MemberService,
  ) {}

  async findAll(query: Query): Promise<Book[]> {
    const resPerPage = Number(query.size) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const books = await this.bookModel
      .find({ borrowed: 0 })
      .limit(resPerPage)
      .skip(skip);

    return books;
  }

  async newBook(book: Book): Promise<Book> {
    const res = await this.bookModel.findOne({ code: book.code });

    if (res) {
      throw new ConflictException('Book already exist');
    }

    return await this.bookModel.create(book);
  }

  async borrowBooks(data: BorrowBooksDto): Promise<Member> {
    const books = await this.bookModel.find({ code: { $in: data.book_codes } });
    const member = await this.memberService.findByCode(data.member_code);
    // return await this.memberService.resetBorrowedByMemberCode(member);

    const borrowedBooks: BorrowedBook[] = [];
    let countBorrowedBooks: number = 0;
    const today = new Date();
    const nextSevenDays = new Date(today.setDate(today.getDate() + 7));

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.is_penalized && member.penalty_end_date > new Date()) {
      throw new BadRequestException(
        'You are being penalized! cannot borrow any book for 3 days',
      );
    }

    // check book that still borrowed by this member
    for (let i = 0; i < member.borrowedBooks.length; i++) {
      if (member.borrowedBooks[i].actual_returning_datetime > new Date()) {
        countBorrowedBooks += 1;
      }
    }

    if (
      data.book_codes.length > 2 ||
      countBorrowedBooks + data.book_codes.length > 2
    ) {
      throw new BadRequestException('Cannot borrow more than 2 books');
    }

    for (let i = 0; i < books.length; i++) {
      if (books[i].stock - books[i].borrowed <= 0) {
        throw new BadRequestException('Book out of stock');
      } else if (books[i].stock - books[i].borrowed > 0) {
        borrowedBooks.push({
          code: books[i].code,
          title: books[i].title,
          borrowing_datetime: new Date(),
          actual_returning_datetime: null,
          designated_returning_datetime: nextSevenDays,
        });
      }
    }

    const res = await this.memberService.addBooksToMe(borrowedBooks, member);

    // flow to update every books that is successfully borrowed by this member
    const objToUpdate = books.map((each) => {
      return {
        updateOne: {
          filter: { code: each.code },
          update: { borrowed: each.borrowed + 1 },
        },
      };
    });
    await this.bookModel.bulkWrite(objToUpdate, { ordered: false });

    return res;
  }

  async returningBooks(data: ReturnBooksDto): Promise<Member> {
    const books = await this.bookModel.find({ code: data.book_code });
    const member = await this.memberService.findBorrowedBookByMember(
      data.member_code,
      data.book_code,
    );

    if (!member) {
      throw new NotFoundException('Data not found');
    }

    await this.memberService.returnBookToLibrary(data.book_code, member);

    await this.memberService.returnBookToLibraryAndPenalize(
      data.book_code,
      member,
    );

    // flow to update every books that is successfully returned to library
    const objToUpdate = books.map((each) => {
      return {
        updateOne: {
          filter: { code: each.code },
          update: { borrowed: each.borrowed - 1 },
        },
      };
    });
    await this.bookModel.bulkWrite(objToUpdate, { ordered: false });

    return await this.memberService.findByCode(data.member_code);
  }
}
