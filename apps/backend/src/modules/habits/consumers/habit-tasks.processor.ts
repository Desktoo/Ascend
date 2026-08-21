import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HABIT_JOBS, HABITS_QUEUE } from 'src/common/queues/queue-names';
import { HabitsService } from '../habits.service';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

interface JobPayLoad {
  timeZone: string;
  windowStartMinutes: number;
  windowEndMinutes: number;
  localDateString: string;
}
@Processor(HABITS_QUEUE)
export class HabitTaskProcessor extends WorkerHost {
  private readonly logger = new Logger(HabitTaskProcessor.name);

  constructor(private readonly habitService: HabitsService) {
    super();
  }

  async process(job: Job<JobPayLoad>): Promise<void> {
    const { timeZone, windowStartMinutes, windowEndMinutes, localDateString } =
      job.data;

    if (job.name === HABIT_JOBS.INITIALIZE_TIMEZONE_TASKS) {
      this.logger.log(
        `Redis alarm triggered for group [${timeZone} @ Window ${windowStartMinutes}m-${windowEndMinutes}m]! Waking up worker...`,
      );

      try {
        await this.habitService.generateHabitTasksForScheduleGroup(
          timeZone,
          windowStartMinutes,
          windowEndMinutes,
          localDateString,
        );
      } catch (error) {
        this.logger.error(
          `Failed executing background batch task generation`,
          error,
        );
        throw error;
      }
    }
  }
}
