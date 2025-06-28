import { Controller, Get, Post, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    getNotifications(@Request() req) {
        const userId = req.user.userId;
        return this.notificationsService.getNotificationsForUser(userId);
    }

    @Post(':id/read')
    @HttpCode(HttpStatus.NO_CONTENT)
    markAsRead(@Request() req, @Param('id', ParseIntPipe) notificationId: number) {
        const userId = req.user.userId;
        return this.notificationsService.markAsRead(notificationId, userId);
    }
}