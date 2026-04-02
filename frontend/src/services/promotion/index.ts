import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PROMOTION } from './graphql/findPromotionQuery'
import { FIND_PROMOTIONS } from './graphql/findPromotionsQuery'
import { CREATE_PROMOTION } from './graphql/createPromotionMutation'
import { UPDATE_PROMOTION } from './graphql/updatePromotionMutation'
import { DELETE_PROMOTION } from './graphql/deletePromotionMutation'
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
        })
        return data?.findPromotions || null
    },
    create: async (payload: Partial<PromotionModel>): Promise<PromotionModel | undefined> => {
        const { data } = await apolloClient.mutate<{ createPromotion: PromotionModel }>({
            mutation: CREATE_PROMOTION,
            variables: {
                data: payload,
            },
        })
        return data?.createPromotion
    },
    update: async (id: number, payload: Partial<PromotionModel>): Promise<PromotionModel | undefined> => {
        const { data } = await apolloClient.mutate<{ updatePromotion: PromotionModel }>({
            mutation: UPDATE_PROMOTION,
            variables: {
                id,
                data: payload,
            },
        })
        return data?.updatePromotion
    },
    delete: async (id: number): Promise<boolean> => {
        const { data } = await apolloClient.mutate<{ deletePromotion: boolean }>({
            mutation: DELETE_PROMOTION,
            variables: { id },
        })
        return !!data?.deletePromotion
    },
}
