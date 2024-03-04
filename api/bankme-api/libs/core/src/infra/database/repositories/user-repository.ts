import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'bme/core/domains/users/interfaces/user-repository.interface';
import { PrismaService } from '../prisma-service';
import { User } from 'bme/core/domains/users/entities/users.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(protected prisma: PrismaService) {}
  async getByLogin(login: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: {
        login,
      },
    });
  }

  async existsLogin(id: string, login: string): Promise<boolean> {
    const result = await this.prisma.user.count({
      where: {
        AND: {
          login,
        },
        NOT: {
          id,
        },
      },
    });

    return result > 0;
  }

  async getAll(): Promise<User[]> {
    return (await this.prisma.user.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })) as User[];
  }

  async getById(id: string): Promise<User> {
    return (await this.prisma.user.findUnique({
      where: { id: id },
    })) as User;
  }

  async create(data: User): Promise<User> {
    return await this.prisma.user.create({
      data: {
        login: data.login,
        password: data.password,
        id: data.id,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      },
    });
  }

  async changeById(id: string, data: User): Promise<User> {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        login: data.login,
        password: data.password,
        id: data.id,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      },
    });
  }

  async removeById(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
