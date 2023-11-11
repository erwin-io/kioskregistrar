import { Test, TestingModule } from '@nestjs/testing';
import { RequestRequirementsController } from './request-requirements.controller';

describe('RequestRequirementsController', () => {
  let controller: RequestRequirementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestRequirementsController],
    }).compile();

    controller = module.get<RequestRequirementsController>(RequestRequirementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
