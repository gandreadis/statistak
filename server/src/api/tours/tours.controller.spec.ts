import { Test, TestingModule } from '@nestjs/testing';
import { ToursController } from './tours.controller';

describe('Tours Controller', () => {
  let controller: ToursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToursController],
    }).compile();

    controller = module.get<ToursController>(ToursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
