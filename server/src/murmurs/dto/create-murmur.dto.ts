// /server/src/murmurs/dto/create-murmur.dto.ts

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMurmurDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(280)
    text: string;
}