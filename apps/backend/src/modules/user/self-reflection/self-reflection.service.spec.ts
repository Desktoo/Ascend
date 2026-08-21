import { Test, TestingModule } from '@nestjs/testing';
import { SelfReflectionService } from './self-reflection.service';

describe('SelfReflectionService', () => {
  let service: SelfReflectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SelfReflectionService],
    }).compile();

    service = module.get<SelfReflectionService>(SelfReflectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
