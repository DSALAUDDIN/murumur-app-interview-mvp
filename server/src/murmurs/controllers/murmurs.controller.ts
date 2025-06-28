// /server/src/murmurs/controllers/murmurs.controller.ts

import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Delete,
    Param,
    ParseIntPipe,
    HttpCode,
    HttpStatus,
    Get,
    Query,
} from '@nestjs/common';
import { MurmursService } from '../services/murmurs.service';
import { CreateMurmurDto } from '../dto/create-murmur.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('api/me/murmurs')
@UseGuards(JwtAuthGuard)
export class MurmursController {
    constructor(private readonly murmursService: MurmursService) {}
    @Post()
    create(@Request() req, @Body() createMurmurDto: CreateMurmurDto) {
        const userId = req.user.userId;
        return this.murmursService.create(createMurmurDto, userId);
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Request() req, @Param('id', ParseIntPipe) murmurId: number) {
        const currentUserId = req.user.userId;
        return this.murmursService.remove(murmurId, currentUserId);
    }
}

@Controller('api/murmurs')
@UseGuards(JwtAuthGuard)
export class TimelineController {
    constructor(private readonly murmursService: MurmursService) {}

    @Get('timeline')
    getTimeline(
        @Request() req,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ) {
        const userId = req.user.userId;
        return this.murmursService.getTimelineForUser(userId, { page, limit });
    }

    @Post(':id/like')
    @HttpCode(HttpStatus.NO_CONTENT)
    like(@Request() req, @Param('id', ParseIntPipe) murmurId: number) {
        const userId = req.user.userId;
        return this.murmursService.like(murmurId, userId);
    }

    @Delete(':id/like')
    @HttpCode(HttpStatus.NO_CONTENT)
    unlike(@Request() req, @Param('id', ParseIntPipe) murmurId: number) {
        const userId = req.user.userId;
        return this.murmursService.unlike(murmurId, userId);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id', ParseIntPipe) murmurId: number) {
        const userId = req.user.userId;
        return this.murmursService.findMurmurById(murmurId, userId);
    }

    @Get()
    findAll(
        @Request() req,
        @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    ) {
        const userId = req.user.userId;
        return this.murmursService.findAll(userId, { page, limit });
    }
}