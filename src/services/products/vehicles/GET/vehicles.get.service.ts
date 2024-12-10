import { AppApiGateWay } from '../../../app.api.gateway'
import { IVehicles } from '../../models/vehicles.interface'

export const fetchVehicles = async (id: string): Promise<IVehicles[]> => {
  const response = await AppApiGateWay.get('/vehicle')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(response.data.filter((p: IVehicles) => p.category._id === id))
    }, 1000)
  })
}
