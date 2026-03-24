export interface UserModel {
  id: number
  name: string
  lastName: string
  email?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface GetUsersResponseDto {
  users: UserModel[]
}

export interface GetUserResponseDto {
  user: UserModel
}

export interface CreateUserInput {
  name: string
  lastName: string
  email: string
  password?: string
}

export interface CreateUserResponse {
  createUser: {
    name: string
    lastName: string
    email: string
  }
}

export interface UpdateUserInput {
  name?: string
  lastName?: string
  email?: string
}

export interface UpdateUserResponse {
  updateUser: {
    name: string
    lastName: string
    email: string
  }
}

export interface DeleteUserResponse {
  deleteUser: boolean
}
