import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service'; 
import { CreateUserDto } from './dto/create-user.dto';

@Controller('url/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    // Convert userId to number if needed, depending on your UsersService implementation
    const id = parseInt(userId, 10);
    return this.usersService.getUserById(id);
  }
}
