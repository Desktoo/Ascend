import { Test, TestingModule } from '@nestjs/testing';
import { TaskLogsService } from './task-logs.service';

describe('TaskLogsService', () => {
  let service: TaskLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskLogsService],
    }).compile();

    service = module.get<TaskLogsService>(TaskLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
