import { ZonedDateTime } from '@internationalized/date'
import { IVehicles } from '../../../services/products/models/vehicles.interface'
import { ITours } from '../../../services/products/models/tours.interface'

export interface ISelectItems {
  dates: {
    start: ZonedDateTime | null
    end: ZonedDateTime | null
  }
  vehicle: IVehicles
  total?: number
}
export interface ISelectData {
  travelers: { adults: number; childrens: number }
  selectedItem: ISelectItems[]
  selectedTours: ITours[]
  branch: string
  transfer: string
}
