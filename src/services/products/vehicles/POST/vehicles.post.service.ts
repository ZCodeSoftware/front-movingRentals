import { IVehicleForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/vehicles-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'

export const postVehicle = async (vehicle: IVehicleForm) => {
  try {
    await AppApiGateWay.post('/vehicle', vehicle)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
