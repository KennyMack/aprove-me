import { IWriterRepository } from 'bme/core/infra/database/writer-repository.interface';
import { Assignor } from '../entities/assignor.entity';
import { IReaderRepository } from 'bme/core/infra/database/reader-repository.interface';

export interface IAssignorRepository
  extends IWriterRepository<Assignor>,
    IReaderRepository<Assignor> {
  documentExists(id: string, document: string): Promise<boolean>;
  emailExists(id: string, email: string): Promise<boolean>;
}
