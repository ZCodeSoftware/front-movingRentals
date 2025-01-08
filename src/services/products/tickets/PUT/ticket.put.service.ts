import { ITicketForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/ticket-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'

export const putTicket = async (id: string, ticket: ITicketForm) => {
  try {
    await AppApiGateWay.put(`/ticket/${id}`, ticket)
  } catch (error) {
    console.error('Error al modificar producto', error)
  }
}
