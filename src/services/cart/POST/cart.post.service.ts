import { ISelectData } from '../../../components/homeRental/models/Select-data'
import { AppApiGateWay } from '../../app.api.gateway'

interface ICartPut {
  cart: ISelectData
  userCartId: string
}

export const postCart = async ({ cart, userCartId }: ICartPut) => {
  console.log('cart', cart);
  
  try {
    await AppApiGateWay.put(`/cart/${userCartId}`, cart)
  } catch (error) {
    console.error('Error al agregar al carrito', error)
  }
}
