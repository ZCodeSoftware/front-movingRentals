import { ITickets } from '../../../../../../services/products/models/tickets.interface'

export interface IUpdateTicket {
  ticketData: ITickets | null
  openUpdateModal: boolean
  setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>
  ticketId: string
  onUpdate: () => Promise<void>
}
