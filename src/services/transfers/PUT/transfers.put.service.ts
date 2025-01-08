import { AppApiGateWay } from '../../../services/app.api.gateway'
import { ITransferForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/transfer-form.interface'

export const putTransfer = async (id: string, transfer: ITransferForm) => {
  try {
    await AppApiGateWay.put(`/transfer/${id}`, transfer)
  } catch (error) {
    console.error('Error al modificar producto', error)
  }
}
