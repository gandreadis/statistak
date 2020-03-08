import { Test, TestingModule } from '@nestjs/testing';
import { PiecesController } from './pieces.controller';

describe('Pieces Controller', () => {
  let controller: PiecesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiecesController],
    }).compile();

    controller = module.get<PiecesController>(PiecesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
