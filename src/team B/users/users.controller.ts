import { Controller, Post, Body, Get, Patch, Delete, Query, Param, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {} // Use renamed import

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    return { message: 'User fetched successfully', ...user };
  }

  @Patch(':id/toggle')
  @UsePipes(new ValidationPipe({ transform: true }))
  async toggleStatus(@Param('id') id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
    const user = await this.usersService.toggleStatus(parseInt(id), updateUserStatusDto);
    return { message: 'User status updated', user };
  }

  // users.controller.ts (verify PATCH endpoint)
@Patch(':id')
@UsePipes(new ValidationPipe({ transform: true }))
async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
  const user = await this.usersService.update(parseInt(id), updateUserDto);
  return { message: 'User updated successfully', user: { id: user.id, userName: user.userName } };
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