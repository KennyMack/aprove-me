import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { UserDomainService } from 'bme/core/domains/users/user-service';

describe('AuthController', () => {
  let controller: AuthController;
  const userDomainService = mock<IUserDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UserDomainService,
          useValue: userDomainService,
        },
      ],
    }).compile();

    mockReset(userDomainService);

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
