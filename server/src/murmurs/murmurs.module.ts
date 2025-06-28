import { Module } from '@nestjs/common';
import { MurmursService } from './services/murmurs.service';
import { MurmursController, TimelineController } from './controllers/murmurs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Murmur } from '../entities/murmur.entity';
import { User } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Murmur, User, Notification])],
    controllers: [MurmursController, TimelineController],
    providers: [MurmursService],
})
export class MurmursModule {}