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
import { UserDomainService } from './domains/users/user-service';
import { PayableQueue } from './infra/rabbitmq/queues/payable.queue';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedeliveryMessages } from './infra/rabbitmq/redelivery';

@Module({
  imports: [EventEmitterModule.forRoot()],
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
    UserDomainService,
    PayableQueue,
    RedeliveryMessages,
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
    UserDomainService,
    PayableQueue,
    RedeliveryMessages,
  ],
})
export class CoreModule {}
