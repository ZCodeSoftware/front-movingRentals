import { ICategories } from '../../categories/models/categories.interface'

export interface ITours {
  _id: string
  name: string
  price: number
  itinerary: string
  capacity: string
  estimatedDuration: string
  startDates: string
  description: string
  images: string[]
  selectedTransfers: any[];
  category: ICategories
}
