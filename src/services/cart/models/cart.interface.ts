import { IBranches } from '../../branches/models/branches.interface'
import { ITours } from '../../products/models/tours.interface'
import { IVehicles } from '../../products/models/vehicles.interface'
import { ITransfers } from '../../transfers/models/transfers.interface'
import { IDeal } from './deals.interface'

export interface ICart {
  _id: string
  vehicles: { vehicle: IVehicles; total: number; dates: { start: Date; end: Date } }[]
  tours: { tour: ITours; date: Date }[]
  deals?: IDeal[]
  branch: IBranches
  transfer: ITransfers
  travelers: { adults: number; childrens: number }
}
