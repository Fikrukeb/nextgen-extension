import {
  AuthGuard, 
  Public,
  Session,
  UserSession,
} from '@mguay/nestjs-better-auth';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDto, UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService,) {}
  @Get('session')
  async getSession(@Session() session: UserSession) {
    return session;
  }

  @Post('create')
  @Public()
  async createUser(@Body() data: UserDto) {
    return await this.usersService.createUser(data);
  }
}
