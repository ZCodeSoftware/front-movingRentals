import { IProducts } from '../../products/models/products.interface'
import { IDeal } from './deals.interface'

export interface ICart {
  _id: string
  products: IProducts[]
  deals?: IDeal[]
  totalPrice: number
}
