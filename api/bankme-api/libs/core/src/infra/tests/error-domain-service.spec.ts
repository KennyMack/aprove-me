import { Test, TestingModule } from '@nestjs/testing';
import { ErrorDomainService } from '../errors/error-domain.service';

describe('ErrorDomainService', () => {
  let service: ErrorDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorDomainService],
    }).compile();

    service = module.get<ErrorDomainService>(ErrorDomainService);
  });

  describe('ErrorDomainService.resetDomain', () => {
    it('should clear all errors of domain', () => {
      for (let i = 0; i < 10; i++) service.addError(`Error: ${i + 1}`);

      expect(service.getErrors().length).toBeGreaterThan(0);
      expect(service.getSuccesses().length).toStrictEqual(0);
      expect(service.getLastError()).not.toBeNull();
      expect(service.getLastSuccess()).toBeNull();

      service.resetDomain();

      expect(service.getErrors().length).toStrictEqual(0);
      expect(service.getSuccesses().length).toStrictEqual(0);
      expect(service.getLastError()).toBeNull();
      expect(service.getLastSuccess()).toBeNull();
    });

    it('should clear all success of domain', () => {
      for (let i = 0; i < 10; i++) service.addSuccess(`Success: ${i + 1}`);

      expect(service.getErrors().length).toStrictEqual(0);
      expect(service.getSuccesses().length).toBeGreaterThan(0);
      expect(service.getLastError()).toBeNull();
      expect(service.getLastSuccess()).not.toBeNull();

      service.resetDomain();

      expect(service.getErrors().length).toStrictEqual(0);
      expect(service.getSuccesses().length).toStrictEqual(0);
      expect(service.getLastError()).toBeNull();
      expect(service.getLastSuccess()).toBeNull();
    });
  });
});
