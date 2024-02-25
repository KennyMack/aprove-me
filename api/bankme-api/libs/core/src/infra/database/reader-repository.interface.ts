export interface IReaderRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T>;
}
