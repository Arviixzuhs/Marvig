export interface ReqChangePasswordByPin {
  pin: string
  email: string
  newPassword: string
  repeatNewPassword: string
}

export interface IAuthRegisterUser {
  email: string
  password: string
  lastName: string
  firstName: string
  repeatPassword: string
}

export interface IAuthLoginUser {
  email: string
  password: string
}
