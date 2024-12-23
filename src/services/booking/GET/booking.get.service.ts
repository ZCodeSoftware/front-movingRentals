import { AppApiGateWay } from '../../app.api.gateway'
import { IBooking } from '../models/booking.interface'

export const fetchBookingByUserId = async (): Promise<IBooking[]> => {
  const response = await AppApiGateWay.get(`/booking/user`)
  return response.data
}
