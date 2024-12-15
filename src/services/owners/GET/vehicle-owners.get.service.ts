import { AppApiGateWay } from '../../app.api.gateway'
import { IVehicleOwners } from '../models/vehicle-owners.interface'

export const fetchAllVehicleOwners = async (): Promise<IVehicleOwners[]> => {
  const response = await AppApiGateWay.get('/vehicle-owner')
  return response.data
}
