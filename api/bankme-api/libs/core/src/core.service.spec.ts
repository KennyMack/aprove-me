import { Test, TestingModule } from '@nestjs/testing';
import { CoreService } from './core.service';
import { MordorCripto } from './mordor-cripto';

describe('CoreService', () => {
  let service: CoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoreService],
    }).compile();

    service = module.get<CoreService>(CoreService);
  });

  describe('MordorCripto', () => {
    it('Should encrypt the text', () => {
      const textToEncrypt = '123456';
      const hashed = MordorCripto.Encrypt(textToEncrypt);

      expect(hashed).not.toBeNull();
      expect(hashed).not.toStrictEqual(textToEncrypt);
    });

    it('Should compare encripted text', () => {
      const textToEncrypt = '123456';
      const hashed = MordorCripto.Encrypt(textToEncrypt);

      const result = MordorCripto.Compare(textToEncrypt, hashed);

      expect(hashed).not.toBeNull();
      expect(hashed).not.toStrictEqual(textToEncrypt);
      expect(result).toStrictEqual(true);
    });
  });
});
