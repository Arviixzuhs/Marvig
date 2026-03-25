import { ApartmentDto } from '@/modules/apartament/application/dto/apartament.dto'
import { ApartamentPage } from '@/modules/apartament/application/dto/apartament-page.dto'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartamentModel } from '@/modules/apartament/domain/models/apartament.model'
import { ApartamentFilterDto } from '@/modules/apartament/application/dto/apartament-filter.dto'
import { FindApartamentUseCase } from '@/modules/apartament/application/usecases/find-apartament.usecase'
import { FindApartamentsUseCase } from '@/modules/apartament/application/usecases/find-apartaments.usecase'
import { UpdateApartamentUseCase } from '@/modules/apartament/application/usecases/update-apartament.usecase'
import { DeleteApartamentUseCase } from '@/modules/apartament/application/usecases/delete-apartament.usecase'
import { CreateApartamentUseCase } from '@/modules/apartament/application/usecases/create-apartament.usecase'
import { UpdateApartamentStatusUseCase } from '@/modules/apartament/application/usecases/update-apartament-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ApartamentModel)
export class ApartamentResolver {
  constructor(
    private readonly findApartamentUseCase: FindApartamentUseCase,
    private readonly findApartamentsUseCase: FindApartamentsUseCase,
    private readonly createApartamentUseCase: CreateApartamentUseCase,
    private readonly updateApartamentUseCase: UpdateApartamentUseCase,
    private readonly deleteApartamentUseCase: DeleteApartamentUseCase,
    private readonly updateApartamentStatusUseCase: UpdateApartamentStatusUseCase,
  ) {}

  @Mutation(() => ApartamentModel)
  createApartament(@Args('data') data: ApartmentDto): Promise<ApartamentModel> {
    return this.createApartamentUseCase.execute(data)
  }

  @Query(() => ApartamentPage)
  findApartaments(@Args('filters') filters: ApartamentFilterDto): Promise<ApartamentPage> {
    return this.findApartamentsUseCase.execute(filters)
  }

  @Query(() => ApartamentModel)
  findApartamentById(@Args('id', { type: () => Int }) id: number): Promise<ApartamentModel> {
    return this.findApartamentUseCase.execute(id)
  }

  @Mutation(() => ApartamentModel)
  updateApartament(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: ApartmentDto,
  ): Promise<ApartamentModel> {
    return this.updateApartamentUseCase.execute(id, data)
  }

  @Mutation(() => ApartamentModel)
  updateApartamentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ApartmentStatus,
  ): Promise<ApartamentModel> {
    return this.updateApartamentStatusUseCase.execute(id, status)
  }

  @Mutation(() => Boolean)
  async deleteApartament(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteApartamentUseCase.execute(id)
    return true
  }
}
