import { GET_USERS } from './graphql/getUsersQuery'
import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import { GET_CURRENT_USER } from './graphql/getCurrentUserQuery'
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
  findCurrent: async () => {
    const { data } = await apolloClient.query<{ findCurrentUser: UserModel }>({
      query: GET_CURRENT_USER,
      fetchPolicy: 'network-only',
    })
    return data?.findCurrentUser || null
  },
}
