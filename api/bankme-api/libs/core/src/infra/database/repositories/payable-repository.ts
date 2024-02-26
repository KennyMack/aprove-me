import { IPayableRepository } from 'bme/core/domains/payables/interfaces/payable-repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { Payable } from 'bme/core/domains/payables/entities/payable.entity';

@Injectable()
export class PayableRepository implements IPayableRepository {
  constructor(protected prisma: PrismaService) {}

  async getAll(): Promise<Payable[]> {
    return (await this.prisma.payable.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })) as Payable[];
  }

  async getById(id: string): Promise<Payable> {
    return (await this.prisma.payable.findUnique({
      where: { id: id },
    })) as Payable;
  }

  async create(data: Payable): Promise<Payable> {
    return await this.prisma.payable.create({
      data: {
        value: data.value,
        emissionDate: new Date(data.emissionDate).toISOString(),
        assignorId: data.assignorId,
        id: data.id,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      },
    });
  }

  async changeById(id: string, data: Payable): Promise<Payable> {
    return await this.prisma.payable.update({
      where: { id: id },
      data: {
        value: data.value,
        emissionDate: new Date(data.emissionDate).toISOString(),
        assignorId: data.assignorId,
        id: data.id,
        createdAt: data.createdAt,
        updateAt: data.updateAt,
      },
    });
  }

  async removeById(id: string): Promise<Payable> {
    return await this.prisma.payable.delete({
      where: { id: id },
    });
  }
}
