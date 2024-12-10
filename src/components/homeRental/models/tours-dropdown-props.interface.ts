import { ITours } from '../../../services/products/models/tours.interface'

export interface IToursDropdownProps {
  loading: Record<string, boolean>
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setSelectData: React.Dispatch<React.SetStateAction<any>>
  selectData: ITours[]
}
