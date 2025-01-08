import { ICategories } from '../../../../../../services/categories/models/categories.interface'

export interface IUpdateCategory {
  categoryData: ICategories | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  categoryId: string
  onUpdate: () => Promise<void>
}
