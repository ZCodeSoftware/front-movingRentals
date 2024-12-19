import { AppApiGateWay } from '../../app.api.gateway'

export const fetchCart = async (cartId: string) => {
  const response = await AppApiGateWay.get(`/cart/${cartId}`)
  return response.data
}
