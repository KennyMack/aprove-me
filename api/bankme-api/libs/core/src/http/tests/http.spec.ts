import { HttpStatus } from '@nestjs/common';
import { HttpResult } from '../http-result';
import { Success } from 'bme/core/messages/success';
import { Fails } from 'bme/core/messages/fails';

describe('HTTP', () => {
  describe('HTTP result objects', () => {
    it('should create a http 200 status', () => {
      const result = HttpResult.Ok({ data: Success.HELLO_WORLD });

      expect(result.success).toStrictEqual(true);
      expect(result.httpStatusCode).toStrictEqual(HttpStatus.OK);
      expect(result.errors).toStrictEqual(null);
      expect(result.body).toStrictEqual({ data: Success.HELLO_WORLD });
    });

    it('should create a http 201 status', () => {
      const result = HttpResult.Created({ data: Success.HELLO_WORLD });

      expect(result.success).toStrictEqual(true);
      expect(result.httpStatusCode).toStrictEqual(HttpStatus.CREATED);
      expect(result.errors).toStrictEqual(null);
      expect(result.body).toStrictEqual({ data: Success.HELLO_WORLD });
    });

    it('should create a http 400 status', () => {
      const result = HttpResult.BadRequest({ data: Success.HELLO_WORLD }, [
        Fails.INVALID_BODY,
      ]);

      expect(result.success).toStrictEqual(false);
      expect(result.httpStatusCode).toStrictEqual(HttpStatus.BAD_REQUEST);
      expect(result.errors).toStrictEqual([Fails.INVALID_BODY]);
      expect(result.body).toStrictEqual({ data: Success.HELLO_WORLD });
    });

    it('should create a http 422 status', () => {
      const result = HttpResult.UnprocessableEntity(
        { data: Success.HELLO_WORLD },
        [Fails.INVALID_BODY],
      );

      expect(result.success).toStrictEqual(false);
      expect(result.httpStatusCode).toStrictEqual(
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      expect(result.errors).toStrictEqual([Fails.INVALID_BODY]);
      expect(result.body).toStrictEqual({ data: Success.HELLO_WORLD });
    });
  });
});
