import { AxiosResponse } from 'axios'
import { IModelUpdateForm } from '../../../pages/dashboard/components/dashboardProducts/updateProduct/models/update-model-form.interface'
import { AppApiGateWay } from '../../../services/app.api.gateway'
import { IModelForm } from '../../../pages/dashboard/components/dashboardProducts/createProduct/models/model-form.interface'

export const putModel = async (id: string, model: IModelUpdateForm): Promise<AxiosResponse> => {
  try {
    return await AppApiGateWay.put(`/vehicle/model/${id}`, model)
  } catch (error) {
    console.error('Error al modificar modelo', error)
    throw error
  }
}
export const putModelName = async (id: string, model: IModelForm): Promise<AxiosResponse> => {
  try {
    return await AppApiGateWay.put(`/cat-model/${id}`, model)
  } catch (error) {
    console.error('Error al modificar modelo', error)
    throw error
  }
}
