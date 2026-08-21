import { Test, TestingModule } from '@nestjs/testing';
import { GoalLogsService } from './goal-logs.service';

describe('GoalLogsService', () => {
  let service: GoalLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalLogsService],
    }).compile();

    service = module.get<GoalLogsService>(GoalLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
