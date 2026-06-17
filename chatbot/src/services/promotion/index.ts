import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PROMOTION } from './graphql/findPromotionQuery'
import { FIND_PROMOTIONS } from './graphql/findPromotionsQuery'
import { PromotionModel, IPromotionFilter } from '@/models/PromotionModel'

export const promotionService = {
  get: async (id: number): Promise<PromotionModel | null> => {
    const { data } = await apolloClient.query<{ findOne: PromotionModel }>({
      query: FIND_PROMOTION,
      variables: { id },
    })
    return data?.findOne || null
  },
  getAll: async (filters: IPromotionFilter): Promise<IPageResponse<PromotionModel> | null> => {
    const { data } = await apolloClient.query<{ findPromotions: IPageResponse<PromotionModel> }>({
      query: FIND_PROMOTIONS,
      variables: { filters },
      fetchPolicy: 'network-only',
    })
    return data?.findPromotions || null
  },
}
