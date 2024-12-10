import { ICategories } from '../../categories/models/categories.interface'

export interface IVehicles {
  _id: string
  category: ICategories
  name: string
  image: string
  specs?: ''
  price: number
}
