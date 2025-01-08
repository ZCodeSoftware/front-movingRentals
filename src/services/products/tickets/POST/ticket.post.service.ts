import { ITicketForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/ticket-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'

export const postTicket = async (ticket: ITicketForm) => {
  try {
    await AppApiGateWay.post('/ticket', ticket)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
