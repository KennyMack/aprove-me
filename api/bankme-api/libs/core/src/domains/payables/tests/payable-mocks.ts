import { Sequence } from 'bme/core/sequence';
import { Payable } from '../entities/payable.entity';
import { PayableVO } from '../vos/payable.vo';
import { Assignor } from '../../assignors/entities/assignor.entity';
import { AssignorMocks } from '../../assignors/tests/assignor-mocks';
import { faker } from '@faker-js/faker';

export class PayableMocks {
  public static getAll(): Payable[] {
    return new Array(5).fill(undefined).map(this.getPayable);
  }

  public static getPayable(): Payable {
    const payable = new Payable();
    payable.id = Sequence.getNext();
    payable.assignorId = Sequence.getNext();
    payable.value = faker.number.float({ multipleOf: 0.25, min: 1, max: 9999 });
    payable.emissionDate = new Date();
    payable.createdAt = new Date();
    payable.updateAt = new Date();
    return payable;
  }

  public static convertPayableToVO(
    payable: Payable,
    assignor: Assignor,
  ): PayableVO {
    return new PayableVO(
      payable.id,
      payable.value,
      payable.emissionDate,
      payable.assignorId,
      AssignorMocks.convertAssignorToVO(assignor),
    );
  }
}
