import { AppApiGateWay } from '../../app.api.gateway'
import { IVehicle_model } from '../models/vehicle_model.interface'

export const fetchAllModels = async (): Promise<IVehicle_model[]> => {
  const response = await AppApiGateWay.get('/cat-model')
  return response.data
}
