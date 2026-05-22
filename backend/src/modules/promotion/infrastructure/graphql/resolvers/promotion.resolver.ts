import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { PromotionType } from '@/modules/promotion/infrastructure/graphql/types/promotion.type'
import { PromotionPageType } from '@/modules/promotion/infrastructure/graphql/types/promotion-page.type'
import { CreatePromotionInput } from '@/modules/promotion/infrastructure/graphql/inputs/create-promotion.input'
import { UpdatePromotionInput } from '@/modules/promotion/infrastructure/graphql/inputs/update-promotion.input'
import { PromotionFilterInput } from '@/modules/promotion/infrastructure/graphql/inputs/promotion-filter.input'
import { FindPromotionUseCase } from '@/modules/promotion/application/usecases/find-promotion.usecase'
import { FindPromotionsUseCase } from '@/modules/promotion/application/usecases/find-promotions.usecase'
import { CreatePromotionUseCase } from '@/modules/promotion/application/usecases/create-promotion.usecase'
import { DeletePromotionUseCase } from '@/modules/promotion/application/usecases/delete-promotion.usecase'
import { UpdatePromotionUseCase } from '@/modules/promotion/application/usecases/update-promotion.usecase'
import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql'

@Resolver(() => PromotionType)
export class PromotionResolver {
  constructor(
    private readonly findPromotionUseCase: FindPromotionUseCase,
    private readonly findPromotionsUseCase: FindPromotionsUseCase,
    private readonly updatePromotionUseCase: UpdatePromotionUseCase,
    private readonly deletePromotionUseCase: DeletePromotionUseCase,
    private readonly createPromotionUseCase: CreatePromotionUseCase,
  ) {}

  @Mutation(() => PromotionType)
  @RequiredRole(UserRole.ADMIN)
  createPromotion(@Args('data') data: CreatePromotionInput): Promise<PromotionType> {
    return this.createPromotionUseCase.execute(data)
  }

  @Query(() => PromotionPageType)
  findPromotions(@Args('filters') filters: PromotionFilterInput): Promise<PromotionPageType> {
    return this.findPromotionsUseCase.execute(filters)
  }

  @Query(() => PromotionType)
  findPromotion(@Args('id', { type: () => Int }) id: number): Promise<PromotionType> {
    return this.findPromotionUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  @RequiredRole(UserRole.ADMIN)
  async deletePromotion(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deletePromotionUseCase.execute(id)
    return true
  }

  @Mutation(() => PromotionType)
  @RequiredRole(UserRole.ADMIN)
  updatePromotion(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdatePromotionInput,
  ): Promise<PromotionType> {
    return this.updatePromotionUseCase.execute(id, data)
  }
}
