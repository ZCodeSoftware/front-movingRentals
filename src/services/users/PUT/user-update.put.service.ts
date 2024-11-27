import { AppApiGateWay } from '../../app.api.gateway'
import { IUserUpdateData } from '../models/update-user-data.interface'

export const userUpdate = async (data: IUserUpdateData) => {
  const response = await AppApiGateWay.put('/user', data)
  return response.data
}
