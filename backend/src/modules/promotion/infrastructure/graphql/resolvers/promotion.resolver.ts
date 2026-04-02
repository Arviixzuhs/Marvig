import { PromotionDto } from '@/modules/promotion/application/dto/promotion.dto'
import { PromotionType } from '@/modules/promotion/infrastructure/graphql/types/promotion.type'
import { PromotionPageType } from '@/modules/promotion/infrastructure/graphql/types/promotion-page.type'
import { PromotionFilterDto } from '@/modules/promotion/application/dto/promotion-filter.dto'
import { UpdatePromotionDto } from '@/modules/promotion/application/dto/update-promotion.dto'
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
  createPromotion(@Args('data') data: PromotionDto): Promise<PromotionType> {
    return this.createPromotionUseCase.execute(data)
  }

  @Query(() => PromotionPageType)
  findPromotions(@Args('filters') filters: PromotionFilterDto): Promise<PromotionPageType> {
    return this.findPromotionsUseCase.execute(filters)
  }

  @Query(() => PromotionType)
  findOne(@Args('id', { type: () => Int }) id: number): Promise<PromotionType> {
    return this.findPromotionUseCase.execute(id)
  }

  @Mutation(() => Boolean)
  async deletePromotion(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.deletePromotionUseCase.execute(id)
    return true
  }

  @Mutation(() => PromotionType)
  updatePromotion(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdatePromotionDto,
  ): Promise<PromotionType> {
    return this.updatePromotionUseCase.execute(id, data)
  }
}
