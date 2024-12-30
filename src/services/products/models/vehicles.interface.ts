import { ICategories } from '../../categories/models/categories.interface'
import { IVehicleOwners } from '../../owners/models/vehicle-owners.interface'

export interface IVehicles {
  _id: string
  category: ICategories
  name: string
  images: string[]
  price?: number
  pricePer4?: number
  pricePer8?: number
  pricePer24?: number
  capacity: number
  minRentalHours: number
  description: string
  owner: IVehicleOwners
  tag: string
}
