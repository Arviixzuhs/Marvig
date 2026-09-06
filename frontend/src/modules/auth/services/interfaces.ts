export interface ReqChangePasswordByPin {
  pin: string
  email: string
  newPassword: string
  repeatNewPassword: string
}

export interface IAuthSigning {
  name: string
  email: string
  lastName: string
}

export interface IAuthConfirmSigning {
  token: string
  password: string
  repeatPassword: string
}

export interface IAuthLoginUser {
  email: string
  password: string
}

export interface IChangePasswordByCode {
  code: string
  newPassword: string
  repeatNewPassword: string
  email: string
}
