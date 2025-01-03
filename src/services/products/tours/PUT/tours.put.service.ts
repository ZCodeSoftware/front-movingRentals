import { ITourForm } from '../../../../pages/dashboard/components/dashboardProducts/createProduct/models/tour-form.interface'
import { AppApiGateWay } from '../../../app.api.gateway'


export const putTour = async (id: string, tour: ITourForm) => {
  try {
    await AppApiGateWay.put(`/tour/${id}`, tour)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
