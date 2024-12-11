import { AppApiGateWayNoJWT } from '../../app.api.gateway-no-jwt'
import { IBranches } from '../models/branches.interface'

export const fetchAllBranches = async (): Promise<IBranches[]> => {
  try {
    const response = await AppApiGateWayNoJWT.get('/branches')
    if (!response) {
      throw new Error('Error fetching categories')
    }
    return response.data
  } catch (error) {
    throw new Error('Error fetching categories:')
  }
}
