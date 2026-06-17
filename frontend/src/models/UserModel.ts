import { IPaginationFilter, IPageResponse } from '@/api/interfaces'

export interface UserModel {
  id: number
  name: string
  role: UserRole
  email?: string
  avatar?: string
  lastName: string
  phone?: string
  password?: string
  hasPassword?: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateMyProfileResponse {
  updateMyProfile: UserModel
}

export interface GetUsersResponseDto {
  users: IPageResponse<UserModel>
}

export interface GetUserResponseDto {
  user: UserModel
}

export interface CreateUserInput
  extends Pick<UserModel, 'name' | 'lastName' | 'email' | 'password'> {}

export interface UpdateUserInput extends Partial<Omit<CreateUserInput, 'password'>> {
  phone?: string
  avatar?: string
}

export interface CreateUserResponse {
  createUser: Pick<UserModel, 'id' | 'name' | 'lastName' | 'email'>
}

export interface UpdateUserResponse {
  updateUser: Pick<UserModel, 'id' | 'name' | 'lastName' | 'email'>
}

export interface DeleteUserResponse {
  deleteUser: boolean
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
  confirmPassword: string
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
  USER = 'USER',
}
