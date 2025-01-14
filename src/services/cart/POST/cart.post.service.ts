import { ISelectData } from '../../../components/homeRental/models/Select-data'
import { AppApiGateWay } from '../../app.api.gateway'

interface ICartPut {
  cart: ISelectData
  userCartId: string
}

export const postCart = async ({ cart, userCartId }: ICartPut) => {

  const formattedCart = {
    ...cart,
    transfer: cart.transfer.filter((t) => t.date !== null),
    selectedTours: cart.selectedTours.filter((t) => t.date !== null),
    selectedItems: cart.selectedItems.filter((t) => t.dates !== null)
  }

  try {
    await AppApiGateWay.put(`/cart/${userCartId}`, { ...formattedCart, branch: '67565e0566c5d8a60202adb8', selectedTours: formattedCart.selectedTours.map((t) => ({ ...t, date: t.date?.replace(/\[.*\]$/, '') })), })
  } catch (error) {
    console.error('Error al agregar al carrito', error)
  }
}
