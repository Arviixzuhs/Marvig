import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_SEASON } from './graphql/getSeasonQuery'
import { FIND_SEASONS } from './graphql/getSeasonsQuery'
import { DELETE_SEASON } from './graphql/deleteSeasonMutation'
import { CREATE_SEASON } from './graphql/createSeasonMutation'
import { UPDATE_SEASON } from './graphql/updateSeasonMutation'
import {
  ICreateSeasonPayload,
  ISeasonFilter,
  IUpdateSeasonPayload,
  SeasonModel,
} from '@/models/SeasonModel'

export const seasonService = {
  get: async (id: number): Promise<SeasonModel | null> => {
    const { data } = await apolloClient.query<{ findSeasonById: SeasonModel }>({
      query: GET_SEASON,
      fetchPolicy: 'network-only',
      variables: { id },
    })
    return data?.findSeasonById || null
  },
  getAll: async (filters: ISeasonFilter): Promise<IPageResponse<SeasonModel> | null> => {
    const { data } = await apolloClient.query<{ findSeasons: IPageResponse<SeasonModel> }>({
      query: FIND_SEASONS,
      fetchPolicy: 'network-only',
      variables: {
        filters,
      },
    })
    return data?.findSeasons || null
  },
  create: async (payload: ICreateSeasonPayload) => {
    const { data } = await apolloClient.mutate<{ createSeason: SeasonModel }>({
      mutation: CREATE_SEASON,
      variables: {
        data: payload,
      },
    })
    return data?.createSeason
  },
  update: async (id: number, payload: IUpdateSeasonPayload) => {
    const { data } = await apolloClient.mutate<{ updateSeason: SeasonModel }>({
      mutation: UPDATE_SEASON,
      variables: {
        // El backend recibe el id dentro de UpdateSeasonInput
        data: { id, ...payload },
      },
    })
    return data?.updateSeason
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<{ deleteSeason: string }>({
      mutation: DELETE_SEASON,
      variables: { id },
    })
    return !!data?.deleteSeason
  },
}
