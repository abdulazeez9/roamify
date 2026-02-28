import { PrismaClient } from '@zagotours/database';
import { prisma } from '@zagotours/database';
import { PaginationOptions, PaginationResult } from '@zagotours/types';

//===== BAS REPOSITORY =====
export abstract class BaseRepository<
  TModel,
  TWhereInput,
  TCreateInput,
  TUpdateInput,
  TInclude = any,
> {
  protected readonly prisma: PrismaClient;
  protected abstract readonly modelDelegate: any;

  constructor() {
    this.prisma = prisma;
  }

  //===== CREATE =====
  async create(data: TCreateInput, include?: TInclude): Promise<TModel> {
    return this.modelDelegate.create({
      data,
      ...(include && { include }),
    });
  }

  //===== UPDATE =====
  async update(
    id: string,
    data: TUpdateInput,
    include?: TInclude,
  ): Promise<TModel> {
    return this.modelDelegate.update({
      where: { id },
      data,
      ...(include && { include }),
    });
  }

  //===== DELETE =====
  async delete(id: string): Promise<TModel> {
    return this.modelDelegate.delete({
      where: { id },
    });
  }

  //===== SOFT DELETE =====
  async softDelete(id: string): Promise<TModel> {
    return this.modelDelegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  //===== FIND BY ID =====
  async findById(id: string, include?: TInclude): Promise<TModel | null> {
    return this.modelDelegate.findUnique({
      where: { id },
      ...(include && { include }),
    });
  }

  //===== GET ALL =====
  async findAll(options?: {
    where?: TWhereInput;
    include?: TInclude;
    orderBy?: any;
  }): Promise<TModel[]> {
    return this.modelDelegate.findMany(options);
  }

  //===== GET ONE =====
  async findOne(
    where: TWhereInput,
    include?: TInclude,
  ): Promise<TModel | null> {
    return this.modelDelegate.findFirst({
      where,
      ...(include && { include }),
    });
  }

  //===== PAGINATION =====
  async paginate(
    options: PaginationOptions<TWhereInput>,
  ): Promise<PaginationResult<TModel>> {
    const { page, limit, where, include, orderBy } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.modelDelegate.findMany({
        where,
        include,
        orderBy,
        skip,
        take: limit,
      }),

      this.modelDelegate.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }
}
