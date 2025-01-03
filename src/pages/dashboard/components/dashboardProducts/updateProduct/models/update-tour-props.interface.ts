import { ITours } from "../../../../../../services/products/models/tours.interface"


export interface IUpdateTour {
  tourData: ITours | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  tourId: string
  onUpdate: () => Promise<void>
}
