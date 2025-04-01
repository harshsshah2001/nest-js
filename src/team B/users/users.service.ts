// users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // Added Like import
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, userName } = createUserDto;
    const existingUser = await this.usersRepository.findOne({ where: { userName } });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(page: number, limit: number, search: string): Promise<any> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { firstName: Like(`%${search}%`) },
          { lastName: Like(`%${search}%`) },
          { userName: Like(`%${search}%`) },
        ]
      : {};

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return {
      users,
      total,
      start: skip + 1,
      end: Math.min(skip + limit, total),
    };
  }

  async findAllWithoutPagination(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async toggleStatus(id: number, updateUserStatusDto: UpdateUserStatusDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = updateUserStatusDto.isActive;
    return this.usersRepository.save(user);
  }

  async delete(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validateUser(userName: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { userName },
      select: ['id', 'userName', 'password', 'isActive']
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new ConflictException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    return user;
  }
}