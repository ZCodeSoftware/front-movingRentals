import { ICategoryForm } from '../../../pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface'
import { AppApiGateWay } from '../../app.api.gateway'

export const putCategory = async (id: string, category: ICategoryForm) => {
  try {
    return await AppApiGateWay.put(`/cat-category/${id}`, category)
  } catch (error) {
    console.error('Error al modificar categoría', error)
    throw error
  }
}
