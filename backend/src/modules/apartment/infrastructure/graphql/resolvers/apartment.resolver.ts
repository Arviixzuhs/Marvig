import { Public } from '@/common/decorators/public.decorator'
import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { ApartmentDto } from '@/modules/apartment/application/dto/apartment.dto'
import { ApartmentType } from '@/modules/apartment/infrastructure/graphql/types/apartment.type'
import { ApartmentPageType } from '@/modules/apartment/infrastructure/graphql/types/apartment-page.type'
import { ApartmentImageDto } from '@/modules/apartment/application/dto/apartment-image.dto'
import { UpdateApartmentDto } from '@/modules/apartment/application/dto/update-apartment.dto'
import { ApartmentFilterDto } from '@/modules/apartment/application/dto/apartment-filter.dto'
import { ApartmentStatusEnum } from '@/modules/apartment/domain/enums/apartment-status.enum'
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
  @RequiredRole(UserRole.ADMIN)
  createApartment(@Args('data') data: ApartmentDto): Promise<ApartmentType> {
    return this.createApartmentUseCase.execute(data)
  }

  @Public()
  @Query(() => ApartmentPageType)
  findApartments(@Args('filters') filters: ApartmentFilterDto): Promise<ApartmentPageType> {
    return this.findApartmentsUseCase.execute(filters)
  }

  @Public()
  @Query(() => ApartmentType)
  findApartmentById(@Args('id', { type: () => Int }) id: number): Promise<ApartmentType> {
    return this.findApartmentUseCase.execute(id)
  }

  @Mutation(() => ApartmentType)
  @RequiredRole(UserRole.ADMIN)
  updateApartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateApartmentDto,
  ): Promise<ApartmentType> {
    return this.updateApartmentUseCase.execute(id, data)
  }

  @Mutation(() => ApartmentType)
  @RequiredRole(UserRole.ADMIN)
  updateApartmentStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status') status: ApartmentStatusEnum,
  ): Promise<ApartmentType> {
    return this.updateApartmentStatusUseCase.execute(id, status)
  }

  @Mutation(() => ApartmentType)
  @RequiredRole(UserRole.ADMIN)
  updateApartmentImages(@Args('data') data: ApartmentImageDto): Promise<ApartmentType> {
    return this.updateApartmentImageUseCase.execute(data)
  }

  @Mutation(() => Boolean)
  @RequiredRole(UserRole.ADMIN)
  async deleteApartment(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deleteApartmentUseCase.execute(id)
    return true
  }
}
