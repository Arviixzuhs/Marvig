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

export interface GetUsersResponseDto {
  users: IPageResponse<UserModel>
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
