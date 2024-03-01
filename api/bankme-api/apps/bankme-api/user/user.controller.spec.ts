import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { UserDomainService } from 'bme/core/domains/users/user-service';

describe('UserController', () => {
  let controller: UserController;
  const userDomainService = mock<IUserDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: UserDomainService,
          useValue: userDomainService,
        },
      ],
    }).compile();

    mockReset(userDomainService);

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
