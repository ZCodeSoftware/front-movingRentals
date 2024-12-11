import { AppApiGateWay } from '../../app.api.gateway'
import { IBranches } from '../models/branches.interface'

export const fetchAllBranches = async (): Promise<IBranches[]> => {
  try {
    const response = await AppApiGateWay.get('/branches')
    if (!response) {
      throw new Error('Error fetching categories')
    }
    return response.data
  } catch (error) {
    throw new Error('Error fetching categories:')
  }
}
