import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { UserDomainService } from 'bme/core/domains/users/user-service';

describe('UserService', () => {
  let service: UserService;
  const userDomainService = mock<IUserDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserDomainService, useValue: userDomainService },
      ],
    }).compile();

    mockReset(userDomainService);

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
