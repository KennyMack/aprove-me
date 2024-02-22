import { Sequence } from 'bme/core/sequence';
import { Payable } from '../entities/payable.entity';
import { PayableVO } from '../vos/payable.vo';

export class PayableMocks {
  public static getAll(): Payable[] {
    const payables: Payable[] = [];
    for (let i = 0; i < 3; i++) {
      const payable = new Payable();
      payable.id = Sequence.getNext();
      payable.assignorId = Sequence.getNext();
      payable.value = (i + 1) * 100;
      payable.emissionDate = new Date();
      payable.createdAt = new Date();
      payable.updateAt = new Date();
    }

    return payables;
  }

  public static getPayable(): Payable {
    const payable = new Payable();
    payable.id = Sequence.getNext();
    payable.assignorId = Sequence.getNext();
    payable.value = 100;
    payable.emissionDate = new Date();
    payable.createdAt = new Date();
    payable.updateAt = new Date();
    return payable;
  }

  public static convertToVO(payables: Payable[]): PayableVO[] {
    return payables.map(
      (x) => new PayableVO(x.id, x.value, x.emissionDate, x.assignorId, null),
    );
  }
}