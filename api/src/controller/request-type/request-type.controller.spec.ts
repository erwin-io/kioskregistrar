import { Test, TestingModule } from '@nestjs/testing';
import { RequestTypeController } from './request-type.controller';

describe('RequestTypeController', () => {
  let controller: RequestTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestTypeController],
    }).compile();

    controller = module.get<RequestTypeController>(RequestTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
