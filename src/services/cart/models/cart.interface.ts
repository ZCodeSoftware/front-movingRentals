import { IProducts } from '../../products/models/products.interface'

export interface ICart {
  _id: string
  products: IProducts[]
  deals: any[]
  totalPrice: number
}
