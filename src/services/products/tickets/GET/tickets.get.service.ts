import { AppApiGateWayNoJWT } from '../../../app.api.gateway-no-jwt'
import { ITickets } from '../../models/tickets.interface'

export const fetchTicket = async (id: string): Promise<ITickets[]> => {
  const response = await AppApiGateWayNoJWT.get(`/ticket/${id}`)
  return response.data
}

export const fetchAllTickets = async (): Promise<ITickets[]> => {
  const response = await AppApiGateWayNoJWT.get('/ticket')
  return response.data
}
