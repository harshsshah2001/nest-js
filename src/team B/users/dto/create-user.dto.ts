import { IsString, IsNotEmpty, MinLength, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  contactNo?: string;

  @IsEmail()
  @IsOptional()
  emailId?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsNotEmpty()
  userRoleId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}