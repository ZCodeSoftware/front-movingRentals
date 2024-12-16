import { ITransferForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/transfer-form.interface'
import { AppApiGateWay } from '../../app.api.gateway'

export const postTransfer = async (transfer: ITransferForm) => {
  try {
    await AppApiGateWay.post('/transfer', transfer)
  } catch (error) {
    console.error('Error al crear producto', error)
  }
}
