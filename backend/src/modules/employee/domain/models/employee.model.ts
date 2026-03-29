export class EmployeeModel {
  id: number
  name: string
  phone: string
  email: string
  lastName: string
  address?: string | null
  createdAt?: Date | null
  updatedAt?: Date | null
}
