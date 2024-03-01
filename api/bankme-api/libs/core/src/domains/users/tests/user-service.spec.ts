import { mock, mockReset } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { Fails } from 'bme/core/messages/fails';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { UserDomainService } from '../user-service';
import { UserMocks } from './user-mocks';
import { UserRepository } from 'bme/core/infra/database/repositories/user-repository';
import { UserVO } from '../vos/user.vo';
import { MordorCripto } from 'bme/core/mordor-cripto';

describe('UserDomainservice', () => {
  let service: UserDomainService;
  const userRepositoryMock = mock<IUserRepository>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDomainService,
        { provide: UserRepository, useValue: userRepositoryMock },
      ],
    }).compile();

    mockReset(userRepositoryMock);

    service = module.get<UserDomainService>(UserDomainService);
  });

  describe('UserDomainService.isValid()', () => {
    it('should be a invalid UserVO', async () => {
      const user = UserMocks.getUser();
      const vo = UserMocks.convertUserToVO(user);

      userRepositoryMock.existsLogin
        .calledWith(user.id, user.login)
        .mockReturnValue(Promise.resolve(true));

      service.resetDomain();
      const result = await service.validate(vo);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(result).toStrictEqual(false);

      expect(userRepositoryMock.existsLogin).toHaveBeenCalledWith(
        user.id,
        user.login,
      );

      expect(userRepositoryMock.existsLogin).toHaveBeenCalledTimes(1);
    });

    it('should be a valid UserVO', async () => {
      const user = UserMocks.getUser();
      const vo = UserMocks.convertUserToVO(user);

      userRepositoryMock.existsLogin
        .calledWith(user.id, user.login)
        .mockReturnValue(Promise.resolve(false));

      service.resetDomain();

      const result = await service.validate(vo);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result).toStrictEqual(true);

      expect(userRepositoryMock.existsLogin).toHaveBeenCalledWith(
        user.id,
        user.login,
      );

      expect(userRepositoryMock.existsLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('UserDomainService.getById()', () => {
    it('should call UserRepository', async () => {
      await service.getById('id');
      expect(userRepositoryMock.getById).toHaveBeenCalledWith('id');
    });

    it('shoud find a result by Id', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.getById
        .calledWith(user.id)
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();
      const result = await service.getById(user.id);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toStrictEqual(user.id);
      expect(result.login).toStrictEqual(user.login);
    });

    it('shoud not find a result by Id', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.getById
        .calledWith(user.id)
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();
      const result = await service.getById('1');

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result).toStrictEqual(null);
    });
  });

  describe('UserDomainService.getAll()', () => {
    it('should call UserRepository', async () => {
      const userResults = UserMocks.getAll();
      userRepositoryMock.getAll.mockReturnValue(Promise.resolve(userResults));
      await service.getAll();
      expect(userRepositoryMock.getAll).toHaveBeenCalled();
    });

    it('should be a empty array', async () => {
      const userResults: Array<UserVO> = [];

      userRepositoryMock.getAll.mockReturnValue(Promise.resolve(userResults));

      const result = await service.getAll();
      expect(result).toStrictEqual([]);
    });

    it('should be a array with items', async () => {
      const mockValues = UserMocks.getAll();
      userRepositoryMock.getAll.mockReturnValue(Promise.resolve(mockValues));

      const result = await service.getAll();

      expect(result.length).toStrictEqual(mockValues.length);
      for (let i = 0; i < result.length; i++) {
        expect(result[i].id).toStrictEqual(mockValues[i].id);
        expect(result[i].login).toStrictEqual(mockValues[i].login);
      }
    });
  });

  describe('UserDomainService.create()', () => {
    it('should fail to create a new user', async () => {
      const user = UserMocks.getUser();

      user.login = '';

      const userVO = UserMocks.convertUserToVO(user);

      await service.create(userVO);

      expect(service.getLastError()).toStrictEqual(Fails.INVALID_LOGIN);
    });

    it('should create a new user', async () => {
      let user = UserMocks.getUser();

      userRepositoryMock.create.mockReturnValue(Promise.resolve(user));

      let userVO = UserMocks.convertUserToVO(user);

      service.resetDomain();
      let result = await service.create(userVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.login).toStrictEqual(user.login);

      user = UserMocks.getUser();
      user.id = null;

      userRepositoryMock.create.mockReturnValue(Promise.resolve(user));

      userVO = UserMocks.convertUserToVO(user);

      service.resetDomain();
      result = await service.create(userVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.login).toStrictEqual(user.login);
    });
  });

  describe('UserDomainService.change()', () => {
    it('should fail to change an user', async () => {
      let user = UserMocks.getUser();
      user.login = '';
      userRepositoryMock.changeById.mockReturnValue(Promise.resolve(user));

      userRepositoryMock.getById
        .calledWith(user.id)
        .mockReturnValue(Promise.resolve(user));

      let userVO = UserMocks.convertUserToVO(user);

      service.resetDomain();
      let result = await service.changeById(userVO.id, userVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_LOGIN);
      expect(userRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(userRepositoryMock.changeById).toHaveBeenCalledTimes(0);

      mockReset(userRepositoryMock);

      user = UserMocks.getUser();
      user.password = '';
      userVO = UserMocks.convertUserToVO(user);
      service.resetDomain();
      result = await service.changeById(userVO.id, userVO);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(service.getLastError()).toStrictEqual(Fails.INVALID_PASSWORD);
      expect(userRepositoryMock.getById).toHaveBeenCalledTimes(0);
      expect(userRepositoryMock.changeById).toHaveBeenCalledTimes(0);
    });

    it('should not find an user to change', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.changeById.mockReturnValue(Promise.resolve(user));

      userRepositoryMock.getById
        .calledWith('1')
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();
      const userVO = UserMocks.convertUserToVO(user);

      const result = await service.changeById(userVO.id, userVO);

      expect(service.getErrors().length).toBeGreaterThanOrEqual(1);
      expect(result).toStrictEqual(null);
    });

    it('should change a user by Id', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.changeById.mockReturnValue(Promise.resolve(user));

      userRepositoryMock.getById
        .calledWith(user.id)
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();

      const userVO = UserMocks.convertUserToVO(user);

      const result = await service.changeById(userVO.id, userVO);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(result.id).toBeDefined();
      expect(result.login).toStrictEqual(user.login);
      expect(result.password).toBeDefined();
    });
  });

  describe('UserDomainService.removeById', () => {
    it('should remove a user by Id', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.removeById
        .calledWith(user.id)
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();
      const result = await service.removeById(user.id);

      expect(result.id).toStrictEqual(user.id);
      expect(result.login).toStrictEqual(user.login);

      expect(userRepositoryMock.removeById).toHaveBeenCalledWith(user.id);
    });

    it('should not find an user to remove', async () => {
      const user = UserMocks.getUser();

      userRepositoryMock.removeById
        .calledWith('1')
        .mockReturnValue(Promise.resolve(user));

      service.resetDomain();
      const result = await service.removeById(user.id);

      expect(result).toStrictEqual(null);
      expect(service.getErrors().length).toStrictEqual(0);

      expect(userRepositoryMock.removeById).toHaveBeenCalledWith(user.id);
    });
  });
});
