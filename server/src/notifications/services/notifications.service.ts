import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
    ) {}

    async getNotificationsForUser(userId: number) {
        const notifications = await this.notificationsRepository.find({
            where: { recipient: { id: userId } },
            relations: ['sender', 'murmur'],
            order: { createdAt: 'DESC' },
            take: 20,
        });
        const unreadCount = await this.notificationsRepository.count({
            where: { recipient: { id: userId }, isRead: false },
        });
        return { notifications, unreadCount };
    }

    async markAsRead(notificationId: number, userId: number): Promise<void> {
        await this.notificationsRepository.update(
            { id: notificationId, recipient: { id: userId } },
            { isRead: true },
        );
    }
}