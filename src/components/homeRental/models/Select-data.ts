import { ZonedDateTime } from '@internationalized/date'
import { IVehicles } from '../../../services/products/models/vehicles.interface'
import { ITours } from '../../../services/products/models/tours.interface'
import { DateValue } from '@nextui-org/react'
import { ITransfers } from '../../../services/transfers/models/transfers.interface'

export interface ISelectItems {
  dates: {
    start: ZonedDateTime | null
    end: ZonedDateTime | null
  }
  vehicle: IVehicles
  total?: number
}
export interface ISelectTours {
  date: DateValue | null
  tour: ITours
}

export interface ISelectTransfers {
  transfer: ITransfers;
  date: Date;
}


export interface ISelectData {
  travelers: { adults: number; childrens: number }
  selectedItems: ISelectItems[]
  selectedTours: ISelectTours[]
  branch: string
  transfer: ISelectTransfers[]
}
