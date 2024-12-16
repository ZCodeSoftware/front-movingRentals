import { ZonedDateTime } from '@internationalized/date'
import { IVehicles } from '../../../services/products/models/vehicles.interface'
import { ITours } from '../../../services/products/models/tours.interface'

export interface ISelectData {
  dates: {
    start: ZonedDateTime
    end: ZonedDateTime
  }
  travelers: { adults: number; childrens: number }
  selectedItem: IVehicles[]
  selectedTours: ITours[]
  branch: string
  transfer: string
}
