import { Sequence } from 'bme/core/sequence';
import { Assignor } from '../entities/assignor.entity';
import { cpf } from 'cpf-cnpj-validator';
import { AssignorVO } from '../vos/assignor.vo';
import { faker } from '@faker-js/faker';

export class AssignorMocks {
  public static getAll(): Assignor[] {
    return new Array(5).fill(undefined).map(this.getAssignor);
  }
  public static getAssignor(): Assignor {
    const assignor = new Assignor();
    assignor.id = Sequence.getNext();
    assignor.document = cpf.generate();
    assignor.email = `${faker.string.alphanumeric(3)}_${faker.internet.email()}`;
    assignor.phone = faker.phone.number();
    assignor.name = faker.person.fullName();
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
