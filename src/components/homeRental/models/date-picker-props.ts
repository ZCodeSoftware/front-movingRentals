import { IVehicles } from '../../../services/products/models/vehicles.interface'

export interface IDatePickerSectionProps {
  selectData: any
  setSelectData: React.Dispatch<React.SetStateAction<any>>
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>
  vehicle: IVehicles
}
