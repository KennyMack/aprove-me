import { mock, mockReset } from 'jest-mock-extended';
import { AssignorDomainService } from '../assignor-service';
import { IAssignorRepository } from '../interfaces/assignor-repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { AssignorRepository } from 'bme/core/infra/database/repositories/assignor-repository';
import { AssignorMocks } from './assignor-mocks';
import { AssignorVO } from '../vos/assignor.vo';
import { Fails } from 'bme/core/messages/fails';

describe('AssignorDomainservice', () => {
  let service: AssignorDomainService;
  const assignorRepositoryMock = mock<IAssignorRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorDomainService,
        { provide: AssignorRepository, useValue: assignorRepositoryMock },
      ],
    }).compile();

    mockReset(assignorRepositoryMock);

    service = module.get<AssignorDomainService>(AssignorDomainService);
  });

  describe('AssignorDomainService.isValid()', () => {
    it('should be a invalid AssignorVO', async () => {
      const assignor = AssignorMocks.getAssignor();
      const vo = AssignorMocks.convertAssignorToVO(assignor);

      assignorRepositoryMock.documentExists
        .calledWith(assignor.id, assignor.document)
        .mockReturnValue(Promise.resolve(true));

      assignorRepositoryMock.emailExists
        .calledWith(assignor.id, assignor.email)
        .mockReturnValue(Promise.resolve(true));

      service.resetDomain();
      const result = await service.validate(vo);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(result).toStrictEqual(false);

      expect(assignorRepositoryMock.documentExists).toHaveBeenCalledWith(
        assignor.id,
        assignor.document,
      );
      expect(assignorRepositoryMock.emailExists).toHaveBeenCalledWith(
        assignor.id,
        assignor.email,
      );

      expect(assignorRepositoryMock.emailExists).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.documentExists).toHaveBeenCalledTimes(1);
    });

    it('should be a valid AssignorVO', async () => {
      const assignor = AssignorMocks.getAssignor();
      const vo = AssignorMocks.convertAssignorToVO(assignor);

      assignorRepositoryMock.documentExists
        .calledWith(assignor.id, assignor.document)
        .mockReturnValue(Promise.resolve(false));

      assignorRepositoryMock.emailExists
        .calledWith(assignor.id, assignor.email)
        .mockReturnValue(Promise.resolve(false));

      service.resetDomain();

      const result = await service.validate(vo);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result).toStrictEqual(true);

      expect(assignorRepositoryMock.documentExists).toHaveBeenCalledWith(
        assignor.id,
        assignor.document,
      );
      expect(assignorRepositoryMock.emailExists).toHaveBeenCalledWith(
        assignor.id,
        assignor.email,
      );

      expect(assignorRepositoryMock.emailExists).toHaveBeenCalledTimes(1);
      expect(assignorRepositoryMock.documentExists).toHaveBeenCalledTimes(1);
    });
  });

  describe('AssignorDomainService.getById()', () => {
    it('should call AssignorRepository', async () => {
      await service.getById('id');
      expect(assignorRepositoryMock.getById).toHaveBeenCalledWith('id');
    });

    it('shoud find a result by Id', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.getById
        .calledWith(assignor.id)
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const result = await service.getById(assignor.id);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toStrictEqual(assignor.id);
      expect(result.email).toStrictEqual(assignor.email);
      expect(result.phone).toStrictEqual(assignor.phone);
      expect(result.email).toStrictEqual(assignor.email);
      expect(result.name).toStrictEqual(assignor.name);
    });

    it('shoud not find a result by Id', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.getById
        .calledWith(assignor.id)
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const result = await service.getById('1');

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result).toStrictEqual(null);
    });
  });

  describe('AssignorDomainService.getAll()', () => {
    it('should call AssignorRepository', async () => {
      const assignorResults = AssignorMocks.getAll();
      assignorRepositoryMock.getAll.mockReturnValue(
        Promise.resolve(assignorResults),
      );
      await service.getAll();
      expect(assignorRepositoryMock.getAll).toHaveBeenCalled();
    });

    it('should be a empty array', async () => {
      const assignorResults: Array<AssignorVO> = [];

      assignorRepositoryMock.getAll.mockReturnValue(
        Promise.resolve(assignorResults),
      );

      const result = await service.getAll();
      expect(result).toStrictEqual([]);
    });

    it('should be a array with items', async () => {
      const mockValues = AssignorMocks.getAll();
      assignorRepositoryMock.getAll.mockReturnValue(
        Promise.resolve(mockValues),
      );

      const result = await service.getAll();

      expect(result.length).toStrictEqual(mockValues.length);
      for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toStrictEqual(mockValues[i].id);
        expect(result[i].name).toStrictEqual(mockValues[i].name);
        expect(result[i].phone).toStrictEqual(mockValues[i].phone);
        expect(result[i].email).toStrictEqual(mockValues[i].email);
        expect(result[i].document).toStrictEqual(mockValues[i].document);
      }
    });
  });

  describe('AssignorDomainService.create()', () => {
    it('should fail to create a new assignor', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignor.document = '';

      const assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      await service.create(assignorVO);

      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
    });

    it('should create a new assignor', async () => {
      let assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      let assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      service.resetDomain();
      let result = await service.create(assignorVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.name).toStrictEqual(assignor.name);
      expect(result.phone).toStrictEqual(assignor.phone);
      expect(result.document).toStrictEqual(assignor.document);
      expect(result.email).toStrictEqual(assignor.email);

      assignor = AssignorMocks.getAssignor();
      assignor.id = null;

      assignorRepositoryMock.create.mockReturnValue(Promise.resolve(assignor));

      assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      service.resetDomain();
      result = await service.create(assignorVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.name).toStrictEqual(assignor.name);
      expect(result.phone).toStrictEqual(assignor.phone);
      expect(result.document).toStrictEqual(assignor.document);
      expect(result.email).toStrictEqual(assignor.email);
    });
  });

  describe('AssignorDomainService.change()', () => {
    it('should fail to change an assignor', async () => {
      let assignor = AssignorMocks.getAssignor();
      assignor.name = '';
      assignorRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(assignor),
      );

      assignorRepositoryMock.getById
        .calledWith(assignor.id)
        .mockReturnValue(Promise.resolve(assignor));

      let assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      service.resetDomain();
      let result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);

      assignor = AssignorMocks.getAssignor();
      assignor.phone = '';
      assignorVO = AssignorMocks.convertAssignorToVO(assignor);
      service.resetDomain();
      result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);

      assignor = AssignorMocks.getAssignor();
      assignor.email = '';
      assignorVO = AssignorMocks.convertAssignorToVO(assignor);
      service.resetDomain();
      result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);

      assignor = AssignorMocks.getAssignor();
      assignor.email = 'email-fail';
      assignorVO = AssignorMocks.convertAssignorToVO(assignor);
      service.resetDomain();
      result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_EMAIL);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);

      assignor = AssignorMocks.getAssignor();
      assignor.document = '';
      assignorVO = AssignorMocks.convertAssignorToVO(assignor);
      service.resetDomain();
      result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_ASSIGNOR);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);

      assignor = AssignorMocks.getAssignor();
      assignor.document = '303.303.303-30';
      assignorVO = AssignorMocks.convertAssignorToVO(assignor);
      service.resetDomain();
      result = await service.changeById(assignorVO.id, assignorVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_DOCUMENT);
      expect(assignorRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(assignorRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(assignorRepositoryMock);
    });

    it('should not find an assignor to change', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(assignor),
      );

      assignorRepositoryMock.getById
        .calledWith('1')
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      const result = await service.changeById(assignorVO.id, assignorVO);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(result).toStrictEqual(null);
    });

    it('should change a assignor by Id', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.changeById.mockReturnValue(
        Promise.resolve(assignor),
      );

      assignorRepositoryMock.getById
        .calledWith(assignor.id)
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const assignorVO = AssignorMocks.convertAssignorToVO(assignor);

      const result = await service.changeById(assignorVO.id, assignorVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.name).toStrictEqual(assignor.name);
      expect(result.phone).toStrictEqual(assignor.phone);
      expect(result.document).toStrictEqual(assignor.document);
      expect(result.email).toStrictEqual(assignor.email);
    });
  });

  describe('AssignorDomainService.removeById', () => {
    it('should remove a payable by Id', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.removeById
        .calledWith(assignor.id)
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const result = await service.removeById(assignor.id);

      expect(result.id).toStrictEqual(assignor.id);
      expect(result.document).toStrictEqual(assignor.document);
      expect(result.phone).toStrictEqual(assignor.phone);
      expect(result.email).toStrictEqual(assignor.email);
      expect(result.name).toStrictEqual(assignor.name);

      expect(assignorRepositoryMock.removeById).toHaveBeenCalledWith(
        assignor.id,
      );
    });

    it('should not find an assignor to remove', async () => {
      const assignor = AssignorMocks.getAssignor();

      assignorRepositoryMock.removeById
        .calledWith('1')
        .mockReturnValue(Promise.resolve(assignor));

      service.resetDomain();
      const result = await service.removeById(assignor.id);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toStrictEqual(0);

      expect(assignorRepositoryMock.removeById).toHaveBeenCalledWith(
        assignor.id,
      );
    });
  });
});
