import { IPayableDomainService } from './interfaces/payable-service.interface';
import { Payable } from './entities/payable.entity';
import { PayableVO } from './vos/payable.vo';
import { Inject, Injectable } from '@nestjs/common';
import { IPayableRepository } from './interfaces/payable-repository.interface';
import { PayableRepository } from 'bme/core/infra/database/repositories/payable-repository';
import { IAssignorRepository } from '../assignors/interfaces/assignor-repository.interface';
import { AssignorRepository } from 'bme/core/infra/database/repositories/assignor-repository';
import { Assignor } from '../assignors/entities/assignor.entity';
import { Sequence } from 'bme/core/sequence';
import { Fails } from 'bme/core/messages/fails';

@Injectable()
export class PayableDomainService implements IPayableDomainService {
  constructor(
    @Inject(PayableRepository)
    private payableRepo: IPayableRepository,
    @Inject(AssignorRepository)
    private assignorRepo: IAssignorRepository,
  ) {}
  async validate(data: PayableVO): Promise<string[]> {
    const validationError = data.isValid();

    if (!!validationError) return [validationError];

    if (data.assignorId) {
      const assignorExists = await this.assignorRepo.getById<Assignor>(
        data.assignorId,
      );
      if (!assignorExists) return [Fails.INVALID_ASSIGNOR_ID];
    }

    return [];
  }

  async getById(id: string): Promise<PayableVO> {
    const result = await this.payableRepo.getById<Payable>(id);

    if (result == null) return null;

    return new PayableVO(
      result.id,
      result.value,
      result.emissionDate,
      result.assignorId,
      null,
    );
  }

  async getAll(): Promise<PayableVO[]> {
    const result = (await this.payableRepo.getAll<Payable>()) ?? [];

    return result.map(
      (x) => new PayableVO(x.id, x.value, x.emissionDate, x.assignorId, null),
    );
  }

  async create(data: PayableVO): Promise<Payable> {
    const createData = new Payable();
    createData.id = Sequence.getNext();
    createData.value = data.value;
    createData.emissionDate = data.emissionDate;
    createData.assignorId = data.assignorId;

    if (data.assignor) {
      const assignorData = new Assignor();
      assignorData.id = Sequence.getNext();
      assignorData.document = data.assignor.document;
      assignorData.email = data.assignor.email;
      assignorData.phone = data.assignor.phone;
      assignorData.name = data.assignor.name;

      const assignorDb = await this.assignorRepo.create(assignorData);

      createData.assignorId = assignorDb.id;
    }

    return await this.payableRepo.create(createData);
  }
  changeById(id: string, data: PayableVO): Promise<Payable> {
    throw new Error('Method not implemented.');
  }
  removeById(id: string): Promise<PayableVO> {
    throw new Error('Method not implemented.');
  }
}
