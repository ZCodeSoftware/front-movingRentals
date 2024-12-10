import { ICategories } from '../../../services/categories/models/categories.interface'

export interface ICategoriesDropdownProps {
  categoriesData: ICategories[]
  vehiclesByCategory: Record<string, any[]>
  selectedItemsByCategory: Record<string, Set<string>>
  loading: Record<string, boolean>
  setVehiclesByCategory: React.Dispatch<React.SetStateAction<Record<string, any[]>>>
  setSelectedItemsByCategory: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setSelectData: React.Dispatch<React.SetStateAction<any>>
}
