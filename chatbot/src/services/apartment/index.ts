import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_APARTMENT } from './graphql/getApartmentQuery'
import { GET_APARTMENTS } from './graphql/getApartmentsQuery'
import { ApartmentModel, IApartmentFilter } from '@/models/ApartmentModel'

export const apartmentService = {
  get: async (id: number): Promise<ApartmentModel | null> => {
    const { data } = await apolloClient.query<{ findApartmentById: ApartmentModel }>({
      query: GET_APARTMENT,
      variables: {
        id,
      },
    })
    return data?.findApartmentById || null
  },
  getAll: async (filters: IApartmentFilter): Promise<IPageResponse<ApartmentModel> | null> => {
    const { data } = await apolloClient.query<{ findApartments: IPageResponse<ApartmentModel> }>({
      query: GET_APARTMENTS,
      variables: {
        filters,
      },
      fetchPolicy: 'network-only',
    })
    return data?.findApartments || null
  },
}
