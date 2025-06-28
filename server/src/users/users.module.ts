// /server/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Murmur } from '../entities/murmur.entity'; // Import Murmur

@Module({
    imports: [TypeOrmModule.forFeature([User, Murmur])], // Add Murmur here
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}