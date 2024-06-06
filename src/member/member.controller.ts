import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { MemberService } from './member.service';
import { Member } from './schema/member.schema';
import { CreateMemberDto } from './dto/createMember.dto';

@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get()
  async getAllMember(
    @Query()
    query: ExpressQuery,
  ): Promise<Member[]> {
    return this.memberService.findAll(query);
  }

  @Get(':id')
  async getMemberById(
    @Param('id')
    id: string,
  ): Promise<Member> {
    return this.memberService.findById(id);
  }

  @Post()
  async createMember(
    @Body()
    member: CreateMemberDto,
  ): Promise<Member> {
    return this.memberService.addNewMember(member);
  }
}
