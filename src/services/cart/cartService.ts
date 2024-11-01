import { mockCart } from '../../mocks/Cart'
import { ICart } from './models/cart.interface'

export const fetchCart = async (id: string): Promise<ICart> => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (mockCart._id === id) resolve(mockCart)
    }, 1000)
  })
}

export const removeCartItem = async (id: string): Promise<ICart> => {
  return new Promise(resolve => {
    const newProducts = mockCart.products.filter(p => p._id !== id)
    mockCart.products = newProducts
    resolve(mockCart)
  })
}
