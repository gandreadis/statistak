import { Test, TestingModule } from '@nestjs/testing';
import { PerformancesController } from './performances.controller';

describe('Performances Controller', () => {
  let controller: PerformancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerformancesController],
    }).compile();

    controller = module.get<PerformancesController>(PerformancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
