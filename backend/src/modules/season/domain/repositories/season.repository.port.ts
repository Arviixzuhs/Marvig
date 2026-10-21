import { SeasonPage } from '@/modules/season/application/dto/season-page.dto'
import { SeasonModel } from '@/modules/season/domain/models/season.model'
import { SeasonFilterDto } from '@/modules/season/application/dto/season-filter.dto'
import { CreateSeasonDto } from '@/modules/season/application/dto/create-season.dto'
import { UpdateSeasonDto } from '@/modules/season/application/dto/update-season.dto'
import { FindOverlappingSeasonsParams } from '@/modules/season/application/dto/find-overlapping-seasons-params.dto'

export interface SeasonRepositoryPort {
  findSeasons(filters: SeasonFilterDto): Promise<SeasonPage>
  findSeasonById(id: number): Promise<SeasonModel | null>
  createSeason(data: CreateSeasonDto): Promise<SeasonModel>
  updateSeason(id: number, data: Omit<UpdateSeasonDto, 'id'>): Promise<SeasonModel>
  softDeleteSeason(id: number): Promise<void>
  findOverlappingSeasons(params: FindOverlappingSeasonsParams): Promise<SeasonModel[]>
  findMissingApartmentIds(apartmentIds: number[]): Promise<number[]>
}
