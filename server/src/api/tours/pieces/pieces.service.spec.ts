import { Test, TestingModule } from '@nestjs/testing';
import { PiecesService } from './pieces.service';

describe('PiecesService', () => {
  let service: PiecesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiecesService],
    }).compile();

    service = module.get<PiecesService>(PiecesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
