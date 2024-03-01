import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from './assignor.service';
import { AssignorDomainService } from 'bme/core/domains/assignors/assignor-service';
import { mock, mockReset } from 'jest-mock-extended';
import { IAssignorDomainService } from 'bme/core/domains/assignors/interfaces/assignor-service.interface';

describe('AssignorService', () => {
  let service: AssignorService;
  const assignorDomainService = mock<IAssignorDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        { provide: AssignorDomainService, useValue: assignorDomainService },
      ],
    }).compile();

    mockReset(assignorDomainService);
    service = module.get<AssignorService>(AssignorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
