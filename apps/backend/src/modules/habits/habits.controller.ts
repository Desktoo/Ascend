import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGaurd,
  type AuthenticatedRequest,
} from 'src/common/gaurds/auth.gaurds';
import { HabitsService } from './habits.service';
import { HabitDto } from './dto/habit.dto';

@Controller('habits')
@UseGuards(AuthGaurd)
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post('create')
  async createHabit(
    @Req() req: AuthenticatedRequest,
    @Body() habitDto: HabitDto,
  ) {
    return this.habitsService.createHabit(req.user.userId, habitDto);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getUsersAllHabits(@Request() req: AuthenticatedRequest) {
    return this.habitsService.getAllHabits(req.user.userId);
  }

  @Get('heatmap-logs')
  async getHeatmapLogs(
    @Query('habitId') habitId: string,
    @Request() req: AuthenticatedRequest, // Adjust depending on your auth strategy setup
  ) {
    const userId = req.user.userId;
    if (!userId) throw new UnauthorizedException('User is not authorized');
    return this.habitsService.getMonthlyHabitLogs(userId, habitId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getHabitById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.habitsService.getHabitById(req.user.userId, id);
  }

  @Patch(':id/toggle')
  async toggleHabitStatus(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.habitsService.toggleHabit(req.user.userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteHabit(
    @Param('id') habitId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    return await this.habitsService.deleteHabit(req.user.userId, habitId);
  }
}
