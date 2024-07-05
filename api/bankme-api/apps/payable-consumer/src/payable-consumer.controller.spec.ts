import { Test, TestingModule } from '@nestjs/testing';
import { PayableConsumerController } from './payable-consumer.controller';
import { PayableConsumerService } from './payable-consumer.service';
import { mock, mockReset } from 'jest-mock-extended';
import { IQueue } from 'bme/core/infra/rabbitmq/queue.interface';
import { PayableQueue } from 'bme/core/infra/rabbitmq/queues/payable.queue';

describe('PayableConsumerController', () => {
  let payableConsumerController: PayableConsumerController;
  const queueService = mock<IQueue>();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PayableConsumerController],
      providers: [
        PayableConsumerService,
        { provide: PayableQueue, useValue: queueService },
      ],
    }).compile();

    mockReset(queueService);

    payableConsumerController = app.get<PayableConsumerController>(
      PayableConsumerController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(payableConsumerController.getHello()).toBe('Hello World!');
    });
  });
});
