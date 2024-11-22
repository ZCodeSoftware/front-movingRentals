import { ZonedDateTime } from '@internationalized/date'
import { IProducts } from '../../../services/products/models/products.interface'
import { ITransfers } from '../../../services/transfers/models/transfers.interface'

export interface ISelectData {
  dates: {
    start: ZonedDateTime
    end: ZonedDateTime
  }
  travelers: { adults: number; childrens: number }
  selectedItem: IProducts[]
  branch: string
  transfer: ITransfers
}
