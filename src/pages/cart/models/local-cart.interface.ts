import { ISelectItems, ISelectTours } from '../../../components/homeRental/models/Select-data'
import { ITransfers } from '../../../services/transfers/models/transfers.interface'

export interface ILocalCart {
  branch: string
  selectedItems: ISelectItems[]
  selectedTours: ISelectTours[]
  transfer: ITransfers[]
  travelers: { adults: number; childrens: number }
}
