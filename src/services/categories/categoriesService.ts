import { ICategories } from './models/categories.interface'
import { AppApiGateWayNoJWT } from '../app.api.gateway-no-jwt'

export const fetchCategories = async (): Promise<ICategories[]> => {
  try {
    const response = await AppApiGateWayNoJWT.get<ICategories[]>('/cat-category')
    console.log(response, 'resp cats')
    if (!response) {
      throw new Error('Error fetching categories')
    }
    return response.data
  } catch (error) {
    throw new Error('Error fetching categories:')
  }
}
