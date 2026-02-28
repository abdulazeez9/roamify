import { PaginationResult } from '@zagotours/types';
import { BaseRepository } from '../repository/base.repository';

//===== EXCEPTION ERROR =====
export class NotFoundException extends Error {
  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id ${id} not found` : `${resource} not found`);
    this.name = 'NotFoundException';
  }
}

export class ForbiddenException extends Error {
  statusCode = 403;
  constructor(message = 'Forbidden') {
    super(message);
  }
}
//===== BASE SERVICE =====
export abstract class BaseService<
  TModel,
  TWhereInput,
  TCreateInput,
  TUpdateInput,
  TInclude = any,
> {
  protected abstract readonly resourceName: string;

  constructor(
    protected readonly repository: BaseRepository<
      TModel,
      TWhereInput,
      TCreateInput,
      TUpdateInput,
      TInclude
    >,
  ) {}

  //===== CREATE =====
  async create(data: TCreateInput): Promise<TModel> {
    return this.repository.create(data);
  }

  //===== UPDATE =====
  async update(id: string, data: TUpdateInput): Promise<TModel> {
    return this.repository.update(id, data);
  }

  //===== DELETE =====
  async delete(id: string, hard = false): Promise<TModel> {
    const item = await this.repository.findById(id);

    if (!item) {
      throw new NotFoundException(this.resourceName, id);
    }

    return hard ? this.repository.delete(id) : this.repository.softDelete(id);
  }

  //===== GET BY ID =====
  async getById(id: string, include?: TInclude): Promise<TModel> {
    const item = await this.repository.findById(id, include);

    if (!item) {
      throw new NotFoundException(this.resourceName, id);
    }

    return item;
  }

  //===== GET ALL =====
  async getAll(options?: {
    where?: TWhereInput;
    include?: TInclude;
    orderBy?: any;
  }): Promise<TModel[]> {
    return this.repository.findAll(options);
  }

  //===== GET ONE =====
  async getOne(where: TWhereInput, include?: TInclude): Promise<TModel | null> {
    return this.repository.findOne(where, include);
  }

  //===== PAGINATION =====
  async paginate(
    page: number,
    limit: number,
    options?: {
      where?: TWhereInput;
      include?: TInclude;
      orderBy?: any;
    },
  ): Promise<PaginationResult<TModel>> {
    return this.repository.paginate({
      page,
      limit,
      ...options,
    });
  }
}
