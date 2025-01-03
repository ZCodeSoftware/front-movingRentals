import { ITransfers } from '../../../../../../services/transfers/models/transfers.interface'

export interface IUpdateTransfer {
  transferData: ITransfers | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  transferId: string
  onUpdate: () => Promise<void>
}
