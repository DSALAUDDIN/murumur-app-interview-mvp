// /server/src/users/controllers/users.controller.ts
import { Controller, Post, Param, ParseIntPipe, UseGuards, Request, HttpCode, HttpStatus, Delete, Get, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('search')
    search(@Query('q') query: string) {
        return this.usersService.searchUsers(query);
    }

    @Post(':id/follow')
    @HttpCode(HttpStatus.NO_CONTENT)
    follow(@Request() req, @Param('id', ParseIntPipe) userIdToFollow: number) {
        const currentUserId = req.user.userId;
        return this.usersService.follow(currentUserId, userIdToFollow);
    }

    @Delete(':id/follow')
    @HttpCode(HttpStatus.NO_CONTENT)
    unfollow(@Request() req, @Param('id', ParseIntPipe) userIdToUnfollow: number) {
        const currentUserId = req.user.userId;
        return this.usersService.unfollow(currentUserId, userIdToUnfollow);
    }

    @Get(':id')
    findProfile(@Request() req, @Param('id', ParseIntPipe) profileId: number) {
        const currentUserId = req.user.userId;
        return this.usersService.findProfile(profileId, currentUserId);
    }

    @Get(':id/following')
    getFollowing(@Param('id', ParseIntPipe) userId: number) {
        return this.usersService.getFollowing(userId);
    }

    @Get(':id/followers')
    getFollowers(@Param('id', ParseIntPipe) userId: number) {
        return this.usersService.getFollowers(userId);
    }
}