import { AppApiGateWay } from '../../../services/app.api.gateway'
import { IOwnerForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/owner-form.interface'

export const putOwner = async (id: string, owner: IOwnerForm) => {
  try {
    return await AppApiGateWay.put(`/vehicle-owner/${id}`, owner)
  } catch (error) {
    console.error('Error al modificar dueño', error)
    throw error
  }
}
