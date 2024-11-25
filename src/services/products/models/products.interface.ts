import { ICategories } from '../../categories/models/categories.interface'

export interface IProducts {
  _id: string
  category: ICategories
  name: string
  image: string
  specs?: {
    engine: string
    maxSpeed: string
    passenger: string
  }
  price: number
}
