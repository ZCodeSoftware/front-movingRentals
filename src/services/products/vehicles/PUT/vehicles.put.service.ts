import { IVehicleForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/vehicles-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'

export const putVehicle = async (id: string, vehicle: IVehicleForm) => {
  try {
    await AppApiGateWay.put(`/vehicle/${id}`, vehicle)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
