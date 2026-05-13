import { IPaginationFilter, IPageResponse } from '@/api/interfaces'

export interface UserModel {
  id: number
  name: string
  role: UserRole
  email?: string
  avatar?: string
  lastName: string
  password?: string
  createdAt: string
  updatedAt: string
}

export interface GetUsersResponseDto {
  users: IPageResponse<UserModel>
}

export interface GetUserResponseDto {
  user: UserModel
}

export interface CreateUserInput
  extends Pick<UserModel, 'name' | 'lastName' | 'email' | 'password'> { }

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> { }

export interface CreateUserResponse {
  createUser: Pick<UserModel, 'id' | 'name' | 'lastName' | 'email'>
}

export interface UpdateUserResponse {
  updateUser: Pick<UserModel, 'id' | 'name' | 'lastName' | 'email'>
}

export interface DeleteUserResponse {
  deleteUser: boolean
}

export interface IUserFilter extends IPaginationFilter {
  search?: string
  name?: string
  email?: string
  fromDate?: string
  toDate?: string
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
