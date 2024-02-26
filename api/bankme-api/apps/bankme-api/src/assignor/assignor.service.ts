import { Inject, Injectable } from '@nestjs/common';
import { CreateAssignorDto } from './dto/create-assignor.dto';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { IAssignorDomainService } from 'bme/core/domains/assignors/interfaces/assignor-service.interface';
import { AssignorDomainService } from 'bme/core/domains/assignors/assignor-service';
import { AssignorVO } from 'bme/core/domains/assignors/vos/assignor.vo';
import { HttpResult } from 'bme/core/http/http-result';

@Injectable()
export class AssignorService {
  constructor(
    @Inject(AssignorDomainService)
    protected assignorService: IAssignorDomainService,
  ) {}

  async create(createAssignorDto: CreateAssignorDto) {
    const assignorVO = new AssignorVO(
      '',
      createAssignorDto.document,
      createAssignorDto.email,
      createAssignorDto.phone,
      createAssignorDto.name,
    );

    try {
      this.assignorService.resetDomain();

      const createResult = await this.assignorService.create(assignorVO);
      const errors = this.assignorService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest(
          createAssignorDto,
          this.assignorService.getErrors(),
        );

      return HttpResult.Created(createResult);
    } catch (e) {
      return HttpResult.UnprocessableEntity(createAssignorDto, [
        e.message,
        ...this.assignorService.getErrors(),
      ]);
    }
  }

  async update(id: string, updateAssignorDto: UpdateAssignorDto) {
    const assignorVO = new AssignorVO(
      id,
      updateAssignorDto.document,
      updateAssignorDto.email,
      updateAssignorDto.phone,
      updateAssignorDto.name,
    );

    try {
      this.assignorService.resetDomain();

      const createResult = await this.assignorService.changeById(
        id,
        assignorVO,
      );
      const errors = this.assignorService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest(
          updateAssignorDto,
          this.assignorService.getErrors(),
        );

      return HttpResult.Ok(createResult);
    } catch (e) {
      return HttpResult.UnprocessableEntity(updateAssignorDto, [
        e.message,
        ...this.assignorService.getErrors(),
      ]);
    }
  }

  async findAll() {
    try {
      this.assignorService.resetDomain();
      const results = await this.assignorService.getAll();
      const errors = this.assignorService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({}, this.assignorService.getErrors());

      return HttpResult.Ok({
        results,
      });
    } catch (e) {
      return HttpResult.BadRequest({}, [
        e.message,
        ...this.assignorService.getErrors(),
      ]);
    }
  }

  async findOne(id: string) {
    try {
      this.assignorService.resetDomain();
      const result = await this.assignorService.getById(id);
      const errors = this.assignorService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({ id }, this.assignorService.getErrors());

      return HttpResult.Ok(result);
    } catch (e) {
      return HttpResult.BadRequest({ id }, [
        e.message,
        ...this.assignorService.getErrors(),
      ]);
    }
  }

  async remove(id: string) {
    try {
      this.assignorService.resetDomain();
      const result = await this.assignorService.removeById(id);
      const errors = this.assignorService.getErrors();

      if (errors.length)
        return HttpResult.BadRequest({ id }, this.assignorService.getErrors());

      return HttpResult.Ok(result);
    } catch (e) {
      return HttpResult.BadRequest({ id }, [
        e.message,
        ...this.assignorService.getErrors(),
      ]);
    }
  }
}
