import { IVehicles } from '../../products/models/vehicles.interface'
import { IDeal } from './deals.interface'

export interface ICart {
  _id: string
  products: IVehicles[]
  deals?: IDeal[]
  totalPrice: number
}
