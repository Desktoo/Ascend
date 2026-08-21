import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Get,
  UseGuards,
  Patch,
  Param,
  Headers,
} from '@nestjs/common';
import { TaskDTO } from './dto/tasks.dto';
import { TasksService } from './tasks.service';
import {
  AuthGaurd,
  type AuthenticatedRequest,
} from 'src/common/gaurds/auth.gaurds';

@Controller('tasks')
@UseGuards(AuthGaurd)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() taskDto: TaskDTO,
    @Req() req: AuthenticatedRequest,
    @Headers('x-user-timezone') timeZone: string,
  ) {
    const userId = req.user.userId;
    return await this.tasksService.createTask(userId, taskDto, timeZone);
  }

  @Get('dashboard')
  async getDashboard(@Req() req: AuthenticatedRequest) {
    return this.tasksService.getDashboardTasks(req.user.userId);
  }

  @Post('abandoned/rescue')
  rescueAbandoned(
    @Req() req: AuthenticatedRequest,
    @Body('taskIds') taskIds: string[],
  ) {
    return this.tasksService.rescheduleTasks(req.user.userId, taskIds);
  }

  @Get()
  async getAllUserTasks(@Req() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    return this.tasksService.getAllTasks(userId);
  }

  @Post('abandoned/purge')
  async purgeAbandoned(
    @Req() req: AuthenticatedRequest,
    @Body('taskIds') taskIds: string[],
  ) {
    return this.tasksService.purgePastTasks(req.user.userId, taskIds);
  }

  @Patch(':id/complete')
  async completeTask(
    @Param('id') taskId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.completeTask(req.user.userId, taskId);
  }
}
