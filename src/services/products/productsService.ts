import { mockProducts } from '../../mocks/Products'
import { IProducts } from './models/products.interface'

export const fetchProducts = async (id: string): Promise<IProducts[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockProducts.filter(p => p.category._id === id))
    }, 1000)
  })
}
