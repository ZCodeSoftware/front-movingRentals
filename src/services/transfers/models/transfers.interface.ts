import { ICategories } from '../../categories/models/categories.interface'

export interface ITransfers {
  _id: string
  name: string
  description?: string
  capacity: number
  estimatedDuration: string
  price: number
  category: ICategories
}
