import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { Success } from './messages/success';
import { Fails } from './messages/fails';
import { Payable } from './domains/payables/entities/payable.entity';
import { PayableVO } from './domains/payables/vos/payable.vo';
import { PayableRepository } from './infra/database/repositories/payable-repository';
import { PrismaService } from './infra/database/prisma-service';
import { PayableDomainService } from './domains/payables/payable-service';
import { AssignorRepository } from './infra/database/repositories/assignor-repository';
import { Sequence } from './sequence';
import { HttpResult } from './http/http-result';
import { AssignorDomainService } from './domains/assignors/assignor-service';
import { UserRepository } from './infra/database/repositories/user-repository';

@Module({
  providers: [
    CoreService,
    Success,
    Fails,
    PrismaService,
    Payable,
    PayableVO,
    PayableRepository,
    PayableDomainService,
    Sequence,
    HttpResult,
    AssignorRepository,
    AssignorDomainService,
    UserRepository,
  ],
  exports: [
    CoreService,
    Success,
    Fails,
    PrismaService,
    Payable,
    PayableVO,
    PayableRepository,
    PayableDomainService,
    Sequence,
    HttpResult,
    AssignorRepository,
    AssignorDomainService,
    UserRepository,
  ],
})
export class CoreModule {}
