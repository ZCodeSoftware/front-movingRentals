import { IRole } from './role.interface'

export interface IUser {
  _id: string
  name: string
  lastName: string
  email: string
  password: string
  role: IRole
  cellphone: string
  documentation: string
  isActive: boolean
  newsletter: boolean
  cart: string
}
