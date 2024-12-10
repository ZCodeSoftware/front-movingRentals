import { ICategories } from '../../categories/models/categories.interface'

export interface ITours {
  _id: string
  description: string
  recommendations: string
  includes: string
  images: string[]
  category: ICategories
}
