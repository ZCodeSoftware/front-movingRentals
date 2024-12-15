import { ITourForm } from '../../dashboardProducts/createProduct/models/tour-form.interface'
import { IVehicleForm } from '../../dashboardProducts/createProduct/models/vehicles-form.interface'

export interface IPreset {
  preset: string
  setUrl: React.Dispatch<React.SetStateAction<IVehicleForm | ITourForm>>
  form: IVehicleForm | ITourForm
  handleMouseEnter: () => void
  handleMouseLeave: () => void
}
