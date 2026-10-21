import { UserRole } from '@/common/enums/user-role.enum'
import { RequiredRole } from '@/common/decorators/required-role.decorator'
import { SeasonPageType } from '@/modules/season/infrastructure/graphql/types/season-page.type'
import { SeasonObjectType } from '@/modules/season/infrastructure/graphql/types/season.type'
import { CreateSeasonInput } from '@/modules/season/infrastructure/graphql/inputs/create-season.input'
import { UpdateSeasonInput } from '@/modules/season/infrastructure/graphql/inputs/update-season.input'
import { SeasonFilterInput } from '@/modules/season/infrastructure/graphql/inputs/season-filter.input'
import { FindSeasonsUseCase } from '@/modules/season/application/usecases/find-seasons.usecase'
import { CreateSeasonUseCase } from '@/modules/season/application/usecases/create-season.usecase'
import { UpdateSeasonUseCase } from '@/modules/season/application/usecases/update-season.usecase'
import { DeleteSeasonUseCase } from '@/modules/season/application/usecases/delete-season.usecase'
import { FindSeasonByIdUseCase } from '@/modules/season/application/usecases/find-season-by-id.usecase'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver(() => SeasonObjectType)
export class SeasonResolver {
  constructor(
    private readonly findSeasonsUseCase: FindSeasonsUseCase,
    private readonly findSeasonByIdUseCase: FindSeasonByIdUseCase,
    private readonly createSeasonUseCase: CreateSeasonUseCase,
    private readonly updateSeasonUseCase: UpdateSeasonUseCase,
    private readonly deleteSeasonUseCase: DeleteSeasonUseCase,
  ) {}

  @Query(() => SeasonPageType)
  @RequiredRole(UserRole.ADMIN)
  findSeasons(@Args('filters') filters: SeasonFilterInput): Promise<SeasonPageType> {
    return this.findSeasonsUseCase.execute(filters)
  }

  @Query(() => SeasonObjectType)
  @RequiredRole(UserRole.ADMIN)
  findSeasonById(@Args('id', { type: () => Int }) id: number): Promise<SeasonObjectType> {
    return this.findSeasonByIdUseCase.execute(id)
  }

  @Mutation(() => SeasonObjectType)
  @RequiredRole(UserRole.ADMIN)
  createSeason(@Args('data') data: CreateSeasonInput): Promise<SeasonObjectType> {
    return this.createSeasonUseCase.execute(data)
  }

  @Mutation(() => SeasonObjectType)
  @RequiredRole(UserRole.ADMIN)
  updateSeason(@Args('data') data: UpdateSeasonInput): Promise<SeasonObjectType> {
    return this.updateSeasonUseCase.execute(data)
  }

  @Mutation(() => String)
  @RequiredRole(UserRole.ADMIN)
  async deleteSeason(@Args('id', { type: () => Int }) id: number): Promise<string> {
    await this.deleteSeasonUseCase.execute(id)
    return 'Temporada eliminada correctamente'
  }
}
