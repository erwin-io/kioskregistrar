import { Test, TestingModule } from '@nestjs/testing';
import { RequestRequirementsService } from './request-requirements.service';

describe('RequestRequirementsService', () => {
  let service: RequestRequirementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestRequirementsService],
    }).compile();

    service = module.get<RequestRequirementsService>(RequestRequirementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
