import { ITourForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/tour-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'

export const postTour = async (vehicle: ITourForm) => {
  try {
    await AppApiGateWay.post('/tour', vehicle)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
