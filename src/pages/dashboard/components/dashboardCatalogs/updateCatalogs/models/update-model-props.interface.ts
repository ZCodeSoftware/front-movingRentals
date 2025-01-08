import { IVehicle_model } from '../../../../../../services/vehicle_model/models/vehicle_model.interface'

export interface IUpdateModel {
  modelData: IVehicle_model | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  modelId: string
  onUpdate: () => Promise<void>
}
