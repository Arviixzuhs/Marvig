import { GET_USERS } from './graphql/getUsersQuery'
import { CREATE_USER } from './graphql/createUserMutation'
import { UPDATE_USER } from './graphql/updateUserMutation'
import { DELETE_USER } from './graphql/deleteUserMutation'
import { apolloClient } from '@/api/apollo-client'
import {
  UserModel,
  UpdateUserInput,
  DeleteUserResponse,
  UpdateUserResponse,
} from '@/models/UserModel'
import {
  CreateUserInput,
  CreateUserResponse,
  GetUserResponseDto,
  GetUsersResponseDto,
} from '@/models/UserModel'

export const userService = {
  queries: {
    getUsers: GET_USERS,
    createUser: CREATE_USER,
    updateUser: UPDATE_USER,
    deleteUser: DELETE_USER,
  },
  get: async (id: number): Promise<UserModel | null> => {
    const { data } = await apolloClient.mutate<GetUserResponseDto>({
      mutation: CREATE_USER,
      variables: {
        data: {
          id,
        },
      },
    })
    return data?.user || null
  },
  getAll: async (): Promise<UserModel[]> => {
    const { data } = await apolloClient.query<GetUsersResponseDto>({
      query: GET_USERS,
    })
    return data?.users || []
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
    console.log(id)
    const { data } = await apolloClient.mutate<DeleteUserResponse>({
      mutation: DELETE_USER,
      variables: { id },
    })
    return !!data?.deleteUser
  },
}
