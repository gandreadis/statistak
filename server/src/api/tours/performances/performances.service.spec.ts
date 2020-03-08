import { Test, TestingModule } from '@nestjs/testing';
import { PerformancesService } from './performances.service';

describe('PerformancesService', () => {
  let service: PerformancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerformancesService],
    }).compile();

    service = module.get<PerformancesService>(PerformancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
