import { ApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentPage } from '@/modules/apartment/application/dto/apartment-page.dto'
import { ApartmentType } from '../types/apartment.type'
import { ApartmentStatus } from 'generated/prisma/enums'
import { ApartmentImageDto } from '@/modules/apartment/application/dto/apartment-image.dto'
import { UpdateApartmentDto } from '@/modules/apartment/application/dto/update-apartment.dto'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'
import { FindApartmentUseCase } from '@/modules/apartment/application/usecases/find-apartment.usecase'
import { FindApartmentsUseCase } from '@/modules/apartment/application/usecases/find-apartments.usecase'
import { UpdateApartmentUseCase } from '@/modules/apartment/application/usecases/update-apartment.usecase'
import { DeleteApartmentUseCase } from '@/modules/apartment/application/usecases/delete-apartment.usecase'
import { CreateApartmentUseCase } from '@/modules/apartment/application/usecases/create-apartment.usecase'
import { UpdateApartmentImagesUseCase } from '@/modules/apartment/application/usecases/update-apartment-images.usecase'
import { UpdateApartmentStatusUseCase } from '@/modules/apartment/application/usecases/update-apartment-status.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => ApartmentType)
export class ApartmentResolver {
  constructor(
    private readonly findApartmentUseCase: FindApartmentUseCase,
    private readonly findApartmentsUseCase: FindApartmentsUseCase,
    private readonly createApartmentUseCase: CreateApartmentUseCase,
    private readonly updateApartmentUseCase: UpdateApartmentUseCase,
    private readonly deleteApartmentUseCase: DeleteApartmentUseCase,
    private readonly updateApartmentImageUseCase: UpdateApartmentImagesUseCase,
    private readonly updateApartmentStatusUseCase: UpdateApartmentStatusUseCase,
  ) {}

  @Mutation(() => ApartmentType)
  createApartment(@Args('data') data: ApartmentDto): Promise<ApartmentType> {
    return this.createApartmentUseCase.execute(data)
  }

  @Query(() => ApartmentPage)
  findApartments(@Args('filters') filters: ApartmentFilterDto): Promise<ApartmentPage> {
    return this.findApartmentsUseCase.execute(filters)
  }

  @Query(() => ApartmentType)
  findApartmentById(@Args('id', { type: () => Int }) id: number): Promise<ApartmentType> {
    return this.findApartmentUseCase.execute(id)
  }

  @Mutation(() => ApartmentType)
  updateApartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateApartmentDto,
  ): Promise<ApartmentType> {
    return this.updateApartmentUseCase.execute(id, data)
  }

  @Mutation(() => ApartmentType)
  updateApartmentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ApartmentStatus,
  ): Promise<ApartmentType> {
    return this.updateApartmentStatusUseCase.execute(id, status)
  }

  @Mutation(() => ApartmentType)
  updateApartmentImages(@Args('data') data: ApartmentImageDto): Promise<ApartmentType> {
    return this.updateApartmentImageUseCase.execute(data)
  }

  @Mutation(() => Boolean)
  async deleteApartment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteApartmentUseCase.execute(id)
    return true
  }
}
