import { AppApiGateWay } from '../../app.api.gateway'

export const fetchUserDetail = async () => {
  const response = await AppApiGateWay.get('/user/detail')
  return response.data
}
