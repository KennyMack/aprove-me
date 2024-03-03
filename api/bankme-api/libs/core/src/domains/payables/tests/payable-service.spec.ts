import { Test, TestingModule } from '@nestjs/testing';
import { PayableDomainService } from '../payable-service';
import { mock, mockReset } from 'jest-mock-extended';
import { IPayableRepository } from '../interfaces/payable-repository.interface';
import { PayableRepository } from 'bme/core/infra/database/repositories/payable-repository';
import { IAssignorRepository } from '../../assignors/interfaces/assignor-repository.interface';
import { AssignorRepository } from 'bme/core/infra/database/repositories/assignor-repository';
import { PayableMocks } from './payable-mocks';
import { AssignorMocks } from '../../assignors/tests/assignor-mocks';
import { Fails } from 'bme/core/messages/fails';
import { PayableVO } from '../vos/payable.vo';
import { format, isValid, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';

describe('PayableDomainService', () => {
  let service: PayableDomainService;
  const payableRepositoryMock = mock<IPayableRepository>();
  const assignorRepositoryMock = mock<IAssignorRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableDomainService,
        { provide: PayableRepository, useValue: payableRepositoryMock },
        { provide: AssignorRepository, useValue: assignorRepositoryMock },
      ],
    }).compile();

    mockReset(payableRepositoryMock);
    mockReset(assignorRepositoryMock);
    service = module.get<PayableDomainService>(PayableDomainService);
  });

  describe('PayableDomainService.isValid()', () => {
    it('should be a invalid PayableVO', async () => {
      let payable = PayableMocks.getPayable();
      payable.assignorId = null;
      let vo = PayableMocks.convertPayableToVO(payable, null);

      let result = await service.validate(vo);

      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
      expect(result).toStrictEqual(false);

      service.resetDomain();
      payable = PayableMocks.getPayable();
      payable.emissionDate = null;

      vo = PayableMocks.convertPayableToVO(payable, null);

      result = await service.validate(vo);

      expect(service.getLastError()).toStrictEqual(Fails.INVALID_EMISSIONDATE);
      expect(result).toStrictEqual(false);

      service.resetDomain();
      payable = PayableMocks.getPayable();
      payable.value = 0;

      vo = PayableMocks.convertPayableToVO(payable, null);

      result = await service.validate(vo);

      expect(service.getLastError()).toStrictEqual(
        Fails.PAYMENTVALUE_MUSTBE_GREATERTHANZERO,
      );
      expect(result).toStrictEqual(false);

      service.resetDomain();
      payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();
      payable.assignorId = null;
      assignor.document = '';

      vo = PayableMocks.convertPayableToVO(payable, assignor);

      result = await service.validate(vo);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_DOCUMENT);
      expect(result).toStrictEqual(false);

      service.resetDomain();
      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();
      payable.assignorId = null;
      assignor.email = 'email';

      vo = PayableMocks.convertPayableToVO(payable, assignor);

      result = await service.validate(vo);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_EMAIL);
      expect(result).toStrictEqual(false);
    });

    it('should be a valid PayableVO', async () => {
      const payable = PayableMocks.getPayable();
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      const vo = PayableMocks.convertPayableToVO(payable, null);

      const result = await service.validate(vo);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );

      expect(service.getErrors()).toStrictEqual([]);
      expect(result).toStrictEqual(true);
    });
  });

  describe('PayableDomainService.getById()', () => {
    it('should call PayableRepository', () => {
      service.getById('id');
      expect(payableRepositoryMock.getById).toHaveBeenCalledWith('id');
    });

    it('should find a result by Id', async () => {
      const payable = PayableMocks.getPayable();
      payableRepositoryMock.getById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      const result = await service.getById(payable.id);

      expect(result.id).toStrictEqual(payable.id);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);
      expect(result.assignorId).toStrictEqual(payable.assignorId);
    });

    it('should not find a result by Id', async () => {
      const payable = PayableMocks.getPayable();
      payableRepositoryMock.getById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      const result = await service.getById('1');

      expect(result).toStrictEqual(null);
    });
  });

  describe('PayableDomainService.getAll()', () => {
    it('should call PayableRepository', async () => {
      const mockValues = PayableMocks.getAll();
      await service.getAll();

      payableRepositoryMock.getAll.mockReturnValue(Promise.resolve(mockValues));

      await service.getAll();
      expect(payableRepositoryMock.getAll).toHaveBeenCalled();
    });
    it('should be a empty array', async () => {
      const payablesResults: Array<PayableVO> = [];
      payableRepositoryMock.getAll.mockReturnValue(
        Promise.resolve(payablesResults),
      );

      const result = await service.getAll();
      expect(result).toStrictEqual([]);
    });
    it('should be a array with items', async () => {
      const mockValues = PayableMocks.getAll();
      payableRepositoryMock.getAll.mockReturnValue(Promise.resolve(mockValues));

      const result = await service.getAll();

      expect(result.length).toStrictEqual(mockValues.length);

      for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toStrictEqual(mockValues[i].id);
        expect(result[i].assignorId).toStrictEqual(mockValues[i].assignorId);
        expect(result[i].value).toStrictEqual(mockValues[i].value);
        expect(result[i].emissionDate).toStrictEqual(
          mockValues[i].emissionDate,
        );
      }
    });
  });

  describe('PayableDomainService.create()', () => {
    it('should fail to create a new payment', async () => {
      let payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();
      payable.assignorId = null;

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      let payableVO = PayableMocks.convertPayableToVO(payable, null);
      let result = await service.create(payableVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(0);

      mockReset(payableRepositoryMock);
      mockReset(assignorRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(null));

      payableVO = PayableMocks.convertPayableToVO(payable, null);
      result = await service.create(payableVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(0);
    });

    it('should create a new payment with assignor Id', async () => {
      let payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();
      payable.assignorId = assignor.id;

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      let payableVO = PayableMocks.convertPayableToVO(payable, null);
      let result = await service.create(payableVO);

      expect(result.id).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);
      expect(result.assignorId).toStrictEqual(payable.assignorId);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(1);

      mockReset(payableRepositoryMock);
      mockReset(assignorRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();
      payable.assignorId = assignor.id;
      payable.id = null;

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      payableVO = PayableMocks.convertPayableToVO(payable, null);
      result = await service.create(payableVO);

      expect(result.id).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);
      expect(result.assignorId).toStrictEqual(payable.assignorId);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should create a new payment and a new assignor', async () => {
      let payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      payable.assignorId = null;

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));
      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      let payableVO = PayableMocks.convertPayableToVO(payable, assignor);
      let result = await service.create(payableVO);

      expect(result.id).toBeDefined();
      expect(result.assignorId).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.create).toHaveBeenCalledTimes(1);

      mockReset(assignorRepositoryMock);
      mockReset(payableRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.getById.mockReturnValue(Promise.resolve(assignor));

      payable.assignorId = null;
      assignor.id = null;

      payableRepositoryMock.create.mockReturnValue(Promise.resolve(payable));
      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      payableVO = PayableMocks.convertPayableToVO(payable, assignor);
      result = await service.create(payableVO);

      expect(result.id).toBeDefined();
      expect(result.assignorId).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('PayableDomainService.change()', () => {
    it('should fail to change a payment', async () => {
      let payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();
      payable.assignorId = null;

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      let payableVO = PayableMocks.convertPayableToVO(payable, null);
      let result = await service.changeById(payableVO.id, payableVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(payableRepositoryMock);
      mockReset(assignorRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(null));

      payableVO = PayableMocks.convertPayableToVO(payable, null);
      service.resetDomain();
      result = await service.changeById(payableVO.id, payableVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(payableRepositoryMock);
      mockReset(assignorRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      payableVO = PayableMocks.convertPayableToVO(payable, null);
      service.resetDomain();
      result = await service.changeById(payableVO.id, payableVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(0);
    });

    it('should change a payment with assignor Id', async () => {
      const payable = PayableMocks.getPayable();
      const assignor = AssignorMocks.getAssignor();
      payable.assignorId = assignor.id;

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );

      payableRepositoryMock.getById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      const payableVO = PayableMocks.convertPayableToVO(payable, null);
      const result = await service.changeById(payableVO.id, payableVO);

      expect(result.id).toStrictEqual(payableVO.id);
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);
      expect(result.assignorId).toStrictEqual(payable.assignorId);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith(
        payable.assignorId,
      );
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(1);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(1);
    });

    it('should change a new payment and create a new assignor', async () => {
      let payable = PayableMocks.getPayable();
      let assignor = AssignorMocks.getAssignor();

      payableRepositoryMock.getById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById
        .calledWith(payable.assignorId)
        .mockReturnValue(Promise.resolve(assignor));

      payable.assignorId = null;

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );
      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      let payableVO = PayableMocks.convertPayableToVO(payable, assignor);

      service.resetDomain();
      let result = await service.changeById(payableVO.id, payableVO);

      expect(result.id).toStrictEqual(payableVO.id);
      expect(result.assignorId).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.create).toHaveBeenCalledTimes(1);

      mockReset(assignorRepositoryMock);
      mockReset(payableRepositoryMock);

      payable = PayableMocks.getPayable();
      assignor = AssignorMocks.getAssignor();

      payableRepositoryMock.getById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      assignorRepositoryMock.getById.mockReturnValue(Promise.resolve(assignor));

      payable.assignorId = null;

      payableRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(payable),
      );
      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      assignor.id = null;
      payableVO = PayableMocks.convertPayableToVO(payable, assignor);

      service.resetDomain();
      result = await service.changeById(payableVO.id, payableVO);

      expect(result.id).toStrictEqual(payableVO.id);
      expect(result.assignorId).toBeDefined();
      expect(result.value).toBeGreaterThan(0);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);

      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(payableRepositoryMock.changeById).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('PayableDomainService.removeById', () => {
    it('should remove a payable by Id', async () => {
      const payable = PayableMocks.getPayable();

      payableRepositoryMock.removeById
        .calledWith(payable.id)
        .mockReturnValue(Promise.resolve(payable));

      service.resetDomain();
      const result = await service.removeById(payable.id);

      expect(result.id).toStrictEqual(payable.id);
      expect(result.value).toStrictEqual(payable.value);
      expect(result.assignorId).toStrictEqual(payable.assignorId);
      expect(result.emissionDate).toStrictEqual(payable.emissionDate);

      expect(payableRepositoryMock.removeById).toHaveBeenCalledWith(payable.id);
    });

    it('should not find a payable to remove', async () => {
      const payable = PayableMocks.getPayable();

      payableRepositoryMock.removeById
        .calledWith('1')
        .mockReturnValue(Promise.resolve(payable));

      service.resetDomain();
      const result = await service.removeById(payable.id);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toStrictEqual(0);

      expect(payableRepositoryMock.removeById).toHaveBeenCalledWith(payable.id);
    });
  });
});
