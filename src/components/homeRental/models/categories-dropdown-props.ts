import { ICategories } from '../../../services/categories/models/categories.interface'

export interface ICategoriesDropdownProps {
  categoriesData: ICategories[]
  vehiclesByCategory: Record<string, any[]>
  loading: Record<string, boolean>
  setVehiclesByCategory: React.Dispatch<React.SetStateAction<Record<string, any[]>>>
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setSelectData: React.Dispatch<React.SetStateAction<any>>
  selectData: any
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedVehicle: React.Dispatch<React.SetStateAction<any>>
}
