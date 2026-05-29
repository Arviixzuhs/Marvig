import { GET_USER } from './graphql/getUserQuery'
import { GET_USERS } from './graphql/getUsersQuery'
import { CREATE_USER } from './graphql/createUserMutation'
import { UPDATE_USER } from './graphql/updateUserMutation'
import { DELETE_USER } from './graphql/deleteUserMutation'
import { UPDATE_MY_PROFILE } from './graphql/updateMyProfileMutation'
import { CHANGE_PASSWORD } from './graphql/changePasswordMutation'
import { apolloClient } from '@/api/apollo-client'
import { IPageResponse } from '@/api/interfaces'
import {
  UserModel,
  IUserFilter,
  UpdateUserInput,
  DeleteUserResponse,
  UpdateUserResponse,
  UpdateMyProfileInput,
  UpdateMyProfileResponse,
} from '@/models/UserModel'
import {
  CreateUserInput,
  CreateUserResponse,
  GetUserResponseDto,
  GetUsersResponseDto,
} from '@/models/UserModel'
import { GET_CURRENT_USER } from './graphql/getCurrentUserQuery'

export const userService = {
  findCurrent: async () => {
    const { data } = await apolloClient.query<{ findCurrentUser: UserModel }>({
      query: GET_CURRENT_USER,
      fetchPolicy: 'network-only',
    })
    return data?.findCurrentUser || null
  },
  get: async (id: number): Promise<UserModel | null> => {
    const { data } = await apolloClient.query<GetUserResponseDto>({
      query: GET_USER,
      variables: {
        id,
      },
    })
    return data?.user || null
  },
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
  create: async (payload: CreateUserInput) => {
    const { data } = await apolloClient.mutate<CreateUserResponse>({
      mutation: CREATE_USER,
      variables: {
        data: payload,
      },
    })
    return data?.createUser
  },
  update: async (id: number, payload: UpdateUserInput) => {
    const { data } = await apolloClient.mutate<UpdateUserResponse>({
      mutation: UPDATE_USER,
      variables: {
        id,
        data: payload,
      },
    })
    return data?.updateUser
  },
  delete: async (id: number): Promise<boolean> => {
    const { data } = await apolloClient.mutate<DeleteUserResponse>({
      mutation: DELETE_USER,
      variables: { id },
    })
    return !!data?.deleteUser
  },
  updateMyProfile: async (payload: UpdateMyProfileInput) => {
    const { data } = await apolloClient.mutate<UpdateMyProfileResponse>({
      mutation: UPDATE_MY_PROFILE,
      variables: {
        data: payload,
      },
    })
    return data?.updateMyProfile
  },
  changePassword: async (payload: any) => {
    const { data } = await apolloClient.mutate<{ changePassword: boolean }>({
      mutation: CHANGE_PASSWORD,
      variables: {
        data: payload,
      },
    })
    return !!data?.changePassword
  },
}

