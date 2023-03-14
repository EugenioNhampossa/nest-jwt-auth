import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { AtGuard } from 'src/common/guards';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AtGuard)
  findOne(@GetUser() user: User) {
    return user;
  }

  @Get()
  @UseGuards(AtGuard)
  findAll() {
    return this.userService.findAll();
  }
}
