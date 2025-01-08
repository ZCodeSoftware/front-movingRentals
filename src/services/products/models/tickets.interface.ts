import { ICategories } from '../../categories/models/categories.interface'

export interface ITickets {
  _id: string
  name: string
  description: string
  location: string
  totalPrice: number
  movingPrice: number
  cenotePrice: number
  category: ICategories
}
