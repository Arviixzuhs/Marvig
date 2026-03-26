import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_APARTMENT } from './graphql/getApartmentQuery'
import { GET_APARTMENTS } from './graphql/getApartmentsQuery'
import { DELETE_APARTMENT } from './graphql/deleteApartmentMutation'
import { UPDATE_APARTMENT } from './graphql/updateApartmentMutation'
import { CREATE_APARTMENT } from './graphql/createApartmentMutation'
import { ApartmentModel, IApartmentFilter } from '@/models/ApartmentModel'

export const apartmentService = {
    get: async (id: number): Promise<ApartmentModel | null> => {
        const { data } = await apolloClient.mutate<{ apartment: ApartmentModel }>({
            mutation: GET_APARTMENT,
            variables: {
                data: {
                    id,
                },
            },
        })
        return data?.apartment || null
    },
    getAll: async (filters: IApartmentFilter): Promise<IPageResponse<ApartmentModel> | null> => {
        const { data } = await apolloClient.query<{ findApartments: IPageResponse<ApartmentModel> }>({
            query: GET_APARTMENTS,
            variables: {
                filters,
            },
        })
        return data?.findApartments || null
    },
    create: async (payload: Partial<ApartmentModel>) => {
        const { data } = await apolloClient.mutate<{ createApartment: ApartmentModel }>({
            mutation: CREATE_APARTMENT,
            variables: {
                data: payload,
            },
        })
        return data?.createApartment
    },
    update: async (id: number, payload: Partial<ApartmentModel>) => {
        const { data } = await apolloClient.mutate<{ updateApartment: ApartmentModel }>({
            mutation: UPDATE_APARTMENT,
            variables: {
                id,
                data: payload,
            },
        })
        return data?.updateApartment
    },
    delete: async (id: number): Promise<boolean> => {
        const { data } = await apolloClient.mutate<{ deleteApartment: boolean }>({
            mutation: DELETE_APARTMENT,
            variables: { id },
        })
        return !!data?.deleteApartment
    },
}
