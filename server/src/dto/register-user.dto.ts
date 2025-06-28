// /server/src/auth/dto/register-user.dto.ts

import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RegisterUserDto {
    @IsNotEmpty({ message: 'Username should not be empty.' })
    @MaxLength(30)
    username: string;

    @IsEmail({}, { message: 'Please provide a valid email address.' })
    email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    password: string;
}