import { ICategoryForm } from '../../../pages/dashboard/components/dashboardCatalogs/createCatalogs/models/category-form.interface'
import { AppApiGateWay } from '../../app.api.gateway'

export const postCategory = async (category: ICategoryForm) => {
  try {
    await AppApiGateWay.post('/cat-category', category)
  } catch (error) {
    console.error('Error al crear categoría', error)
  }
}
