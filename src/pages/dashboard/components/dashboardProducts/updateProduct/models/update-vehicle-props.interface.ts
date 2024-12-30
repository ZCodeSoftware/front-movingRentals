import { IVehicles } from '../../../../../../services/products/models/vehicles.interface'

export interface IUpdateVehicleProps {
  vehicleData: IVehicles | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  vehicleId: string
  onUpdate: () => Promise<void>
}
