import { IOwnerForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/owner-form.interface'
import { AppApiGateWay } from '../../app.api.gateway'

export const postOwner = async (owner: IOwnerForm) => {
  try {
    await AppApiGateWay.post('/vehicle-owner', owner)
  } catch (error) {
    console.error('Error al crear dueño', error)
  }
}
