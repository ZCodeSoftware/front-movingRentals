import { ITransfers } from '../../../services/transfers/models/transfers.interface'

export interface ITransferSelectProps {
  transfer: ITransfers
  onTransferChange: (transfer: ITransfers) => void
}
