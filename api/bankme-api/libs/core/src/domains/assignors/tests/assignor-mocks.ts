import { Sequence } from 'bme/core/sequence';
import { Assignor } from '../entities/assignor.entity';
import { cpf } from 'cpf-cnpj-validator';
import { AssignorVO } from '../vos/assignor.vo';

export class AssignorMocks {
  public static getAll(): Assignor[] {
    const assignors: Assignor[] = [];
    for (let i = 0; i < 5; i++) {
      const assignor = new Assignor();
      assignor.id = Sequence.getNext();
      assignor.name = `Pessoa ${i + 1}`;
      assignor.phone = `(1${i + 1}) 9${i + 1}83${i + 1}-${i + 1}2${i + 1}3`;
      assignor.email = `contato${i + 1}@liame.com`;
      assignor.document = cpf.generate();
      assignor.createdAt = new Date();
      assignor.updateAt = new Date();
      assignors.push(assignor);
    }

    return assignors;
  }
  public static getAssignor(): Assignor {
    const assignor = new Assignor();
    assignor.id = Sequence.getNext();
    assignor.document = cpf.generate();
    assignor.email = 'email@liame.com';
    assignor.phone = '(19) 98765-4321';
    assignor.name = 'Name Surname';
    assignor.createdAt = new Date();
    assignor.updateAt = new Date();
    return assignor;
  }

  public static convertAssignorToVO(assignor: Assignor): AssignorVO {
    if (!assignor) return null;
    return new AssignorVO(
      assignor.id,
      assignor.document,
      assignor.email,
      assignor.phone,
      assignor.name,
    );
  }
}
