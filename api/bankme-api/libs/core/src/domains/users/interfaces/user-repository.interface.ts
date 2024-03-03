import { IWriterRepository } from 'bme/core/infra/database/writer-repository.interface';
import { User } from '../entities/users.entity';
import { IReaderRepository } from 'bme/core/infra/database/reader-repository.interface';

export interface IUserRepository
  extends IWriterRepository<User>,
    IReaderRepository<User> {
  existsLogin(id: string, login: string): Promise<boolean>;
  getByLogin(login: string): Promise<User>;
}
