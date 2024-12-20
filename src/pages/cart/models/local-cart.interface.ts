import { ISelectItems, ISelectTours, ISelectTransfers } from '../../../components/homeRental/models/Select-data'

export interface ILocalCart {
  branch: string
  selectedItems: ISelectItems[]
  selectedTours: ISelectTours[]
  transfer: ISelectTransfers[]
  travelers: { adults: number; childrens: number }
}
