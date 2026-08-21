import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import {
  AuthGaurd,
  type AuthenticatedRequest,
} from 'src/common/gaurds/auth.gaurds';
import { CreateGoalDto } from './dto/goal.dto';
import { TaskLogService } from '../tasks/task-logs/task-logs.service';

@Controller('goals')
@UseGuards(AuthGaurd) // Apply the AuthGaurd to all routes in this controller
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private readonly taskLogService: TaskLogService,
  ) {}

  @Post()
  async createGoal(
    @Body() createGoalDto: CreateGoalDto,
    @Req() req: AuthenticatedRequest, // Adjust depending on where your middleware stores your user context
  ) {
    // Replace fallback string with your actual user extraction strategy (e.g., req.user.id)
    const userId = req.user.userId;
    return this.goalsService.createGoal(userId, createGoalDto);
  }

  @Get('all')
  async getAllGoals(@Req() req: AuthenticatedRequest) {
    return this.goalsService.getAllGoals(req.user.userId);
  }

  @Get('planning')
  async getGoalsForPlanning(@Req() req: AuthenticatedRequest) {
    return this.goalsService.getGoalsForPlanning(req.user.userId);
  }

  @Get(':id')
  async getGoalById(
    @Req() req: AuthenticatedRequest,
    @Param('id') goalId: string,
  ) {
    return await this.goalsService.getGoalById(req.user.userId, goalId);
  }

  @Get(':goalId/task-logs')
  async getGoalTaskLogs(@Param('goalId', ParseUUIDPipe) goalId: string) {
    return this.taskLogService.getGoalTaskLogs(goalId);
  }
}
