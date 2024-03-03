import { HttpStatusInterceptor } from '../http-status.interceptor';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { mock, mockReset } from 'jest-mock-extended';

describe('HttpStatusInterceptor', () => {
  let interceptor: HttpStatusInterceptor;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    interceptor = new HttpStatusInterceptor();
    mockExecutionContext = mock<ExecutionContext>();
    mockExecutionContext.switchToHttp().getResponse().status = jest
      .fn()
      .mockReturnThis();
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should set HTTP status code if provided in the returned data', (done) => {
    const data = { httpStatusCode: 201 };
    const callHandler = {
      handle: jest.fn().mockReturnValue(of(data)),
    } as any;

    interceptor.intercept(mockExecutionContext, callHandler).subscribe(() => {
      expect(
        mockExecutionContext.switchToHttp().getResponse().status,
      ).toHaveBeenCalledWith(201);
      done();
    });
  });

  it('should not set HTTP status code if not provided in the returned data', (done) => {
    const data = {};
    const callHandler = {
      handle: jest.fn().mockReturnValue(of(data)),
    } as any;

    interceptor.intercept(mockExecutionContext, callHandler).subscribe(() => {
      expect(
        mockExecutionContext.switchToHttp().getResponse().status,
      ).not.toHaveBeenCalled();
      done();
    });
  });
});
