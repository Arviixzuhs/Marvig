import { GET_USERS } from './graphql/getUsersQuery'
import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GetUsersResponseDto, IUserFilter, UserModel } from '@/models/UserModel'

export const userService = {
  getAll: async (filters: IUserFilter): Promise<IPageResponse<UserModel> | null> => {
    const { data } = await apolloClient.query<GetUsersResponseDto>({
      query: GET_USERS,
      fetchPolicy: 'network-only',
      variables: {
        filters,
      },
    })
    return data?.users || null
  },
}
