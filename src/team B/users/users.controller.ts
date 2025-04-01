// users.controller.ts
import { Controller, Post, Body, Get, Patch, Delete, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService as UsersServiceClass } from './users.service'; // Rename import to avoid conflict
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersServiceClass) {} // Use renamed import

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return { message: 'User created successfully', user: { id: user.id, userName: user.userName } };
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    return this.usersService.findAll(parseInt(page), parseInt(limit), search);
  }

  @Get('all')
  async findAllWithoutPagination() {
    const users = await this.usersService.findAllWithoutPagination();
    return { message: 'All users fetched successfully', users };
  }

  @Patch(':id/toggle')
  async toggleStatus(@Param('id') id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.usersService.toggleStatus(parseInt(id), updateUserStatusDto);
    return { message: 'User status updated', user };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.usersService.delete(parseInt(id));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto) {
    const user = await this.usersService.validateUser(loginDto.userName, loginDto.password);
    return { message: 'Login successful', user: { id: user.id, userName: user.userName } };
  }
}