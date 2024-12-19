import { ITransfers } from '../../../services/transfers/models/transfers.interface'

export interface ITransferSelectProps {
  onTransferChange: (transfer: ITransfers[]) => void
}
