import { PageType } from '@/common/dto/page-response.dto'
import { SeasonModel } from '@/modules/season/domain/models/season.model'

export class SeasonPage extends PageType(SeasonModel) {}
