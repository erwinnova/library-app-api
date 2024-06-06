import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import { Book } from './schema/book.schema';
import { BorrowBooksDto } from './dto/borrowBook.dto';
import { ReturnBooksDto } from './dto/returnBook.dto';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async getAllBook(
    @Query()
    query: ExpressQuery,
  ): Promise<Book[]> {
    return this.bookService.findAll(query);
  }

  @Post()
  async createBook(
    @Body()
    book: CreateBookDto,
  ): Promise<Book> {
    return this.bookService.newBook(book);
  }

  @Post('borrow')
  async borrowBooks(
    @Body()
    data: BorrowBooksDto,
  ) {
    return this.bookService.borrowBooks(data);
  }

  @Post('return-book')
  async returnBooks(
    @Body()
    data: ReturnBooksDto,
  ) {
    return this.bookService.returningBooks(data);
  }
}
