import { ApartmentDto, UpdateApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentPage } from '@/modules/apartment/application/dto/apartment-page.dto'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartmentModel } from '@/modules/apartment/domain/models/apartment.model'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'
import { FindApartmentUseCase } from '@/modules/apartment/application/usecases/find-apartment.usecase'
import { FindApartmentsUseCase } from '@/modules/apartment/application/usecases/find-apartments.usecase'
import { UpdateApartmentUseCase } from '@/modules/apartment/application/usecases/update-apartment.usecase'
import { DeleteApartmentUseCase } from '@/modules/apartment/application/usecases/delete-apartment.usecase'
import { CreateApartmentUseCase } from '@/modules/apartment/application/usecases/create-apartment.usecase'
import { UpdateApartmentStatusUseCase } from '@/modules/apartment/application/usecases/update-apartment-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ApartmentModel)
export class ApartmentResolver {
  constructor(
    private readonly findApartmentUseCase: FindApartmentUseCase,
    private readonly findApartmentsUseCase: FindApartmentsUseCase,
    private readonly createApartmentUseCase: CreateApartmentUseCase,
    private readonly updateApartmentUseCase: UpdateApartmentUseCase,
    private readonly deleteApartmentUseCase: DeleteApartmentUseCase,
    private readonly updateApartmentStatusUseCase: UpdateApartmentStatusUseCase,
  ) {}

  @Mutation(() => ApartmentModel)
  createApartment(@Args('data') data: ApartmentDto): Promise<ApartmentModel> {
    return this.createApartmentUseCase.execute(data)
  }

  @Query(() => ApartmentPage)
  findApartments(@Args('filters') filters: ApartmentFilterDto): Promise<ApartmentPage> {
    return this.findApartmentsUseCase.execute(filters)
  }

  @Query(() => ApartmentModel)
  findApartmentById(@Args('id', { type: () => Int }) id: number): Promise<ApartmentModel> {
    return this.findApartmentUseCase.execute(id)
  }

  @Mutation(() => ApartmentModel)
  updateApartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateApartmentDto,
  ): Promise<ApartmentModel> {
    return this.updateApartmentUseCase.execute(id, data)
  }

  @Mutation(() => ApartmentModel)
  updateApartmentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ApartmentStatus,
  ): Promise<ApartmentModel> {
    return this.updateApartmentStatusUseCase.execute(id, status)
  }

  @Mutation(() => Boolean)
  async deleteApartment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteApartmentUseCase.execute(id)
    return true
  }
}
