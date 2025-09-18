import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  name: string;

  // Optional property with class-validator
  @IsNotEmpty({ each: true })
  role?: Role = Role.MEMBER; // Default role is MEMBER
}
