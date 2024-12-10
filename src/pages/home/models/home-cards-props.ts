import { ICategories } from '../../../services/categories/models/categories.interface'
import { ITours } from '../../../services/products/models/tours.interface'

export interface IHomeCardProps {
  items: ICategories[] | ITours[]
}
