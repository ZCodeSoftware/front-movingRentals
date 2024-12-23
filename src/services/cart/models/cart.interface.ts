import { IBranches } from '../../branches/models/branches.interface'
import { ITours } from '../../products/models/tours.interface'
import { IVehicles } from '../../products/models/vehicles.interface'
import { ITransfers } from '../../transfers/models/transfers.interface'
import { IDeal } from './deals.interface'

export interface ICartVehicles {
  vehicle: IVehicles
  total: number
  dates: { start: Date; end: Date }
}

export interface ICartTours {
  tour: ITours
  date: Date
}
export interface ICartTranfer {
  transfer: ITransfers
  date: Date
}

export interface ICart {
  _id: string
  vehicles: ICartVehicles[]
  tours: ICartTours[]
  deals?: IDeal[]
  branch: IBranches
  transfer: ICartTranfer
  travelers: { adults: number; childrens: number }
}
