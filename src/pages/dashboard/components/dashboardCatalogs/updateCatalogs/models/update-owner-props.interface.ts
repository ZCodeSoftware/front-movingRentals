import { IVehicleOwners } from '../../../../../../services/owners/models/vehicle-owners.interface'

export interface IUpdateOwner {
  ownerData: IVehicleOwners | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  ownerId: string
  onUpdate: () => Promise<void>
}
