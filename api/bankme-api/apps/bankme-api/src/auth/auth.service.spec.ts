import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IUserDomainService } from 'bme/core/domains/users/interfaces/user-service.interface';
import { UserDomainService } from 'bme/core/domains/users/user-service';

describe('AuthService', () => {
  let service: AuthService;
  const userDomainService = mock<IUserDomainService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserDomainService, useValue: userDomainService },
      ],
    }).compile();

    mockReset(userDomainService);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
