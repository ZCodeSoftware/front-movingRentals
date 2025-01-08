import { IModelForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/model-form.interface'
import { AppApiGateWay } from '../../app.api.gateway'

export const postModel = async (model: IModelForm) => {
  try {
    await AppApiGateWay.post('/cat-model', model)
  } catch (error) {
    console.error('Error al crear modelo', error)
  }
}
