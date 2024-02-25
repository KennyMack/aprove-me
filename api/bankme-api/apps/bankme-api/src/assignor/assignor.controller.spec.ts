import { Test, TestingModule } from '@nestjs/testing';
import { AssignorController } from './assignor.controller';
import { AssignorService } from './assignor.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IAssignorDomainService } from 'bme/core/domains/assignors/interfaces/assignor-service.interface';
import { AssignorDomainService } from 'bme/core/domains/assignors/assignor-service';

describe('AssignorController', () => {
  let controller: AssignorController;
  const assignorDomainService = mock<IAssignorDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorController],
      providers: [
        AssignorService,
        { provide: AssignorDomainService, useValue: assignorDomainService },
      ],
    }).compile();

    mockReset(assignorDomainService);
    controller = module.get<AssignorController>(AssignorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
