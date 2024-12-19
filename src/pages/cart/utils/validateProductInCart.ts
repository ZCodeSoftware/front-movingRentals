import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage'
import { setLocalStorage } from '../../../utils/local-storage/setLocalStorage'
import { ILocalCart } from '../models/local-cart.interface'

const ValidateProductInCart = (productToCart: ILocalCart) => {
  let cart: ILocalCart = getLocalStorage('cart') || {
    branch: '',
    selectedItems: [],
    selectedTours: [],
    transfer: '',
    travelers: { adults: 1, childrens: 0 }
  }

  if (productToCart.selectedItems.length > 0) {
    productToCart.selectedItems.forEach(newItem => {
      const exists = cart.selectedItems.some(item => item.vehicle._id === newItem.vehicle._id)
      if (!exists) {
        cart.selectedItems.push(newItem)
      }
    })
  }

  if (productToCart.selectedTours.length > 0) {
    productToCart.selectedTours.forEach(newTour => {
      const exists = cart.selectedTours.some(tour => tour.tour._id === newTour.tour._id)
      if (!exists) {
        cart.selectedTours.push(newTour)
      }
    })
  }

  if (productToCart.transfer) {
    cart.transfer = productToCart.transfer
  }

  if (productToCart.branch) {
    cart.branch = productToCart.branch
  }

  if (productToCart.travelers) {
    cart.travelers = productToCart.travelers
  }

  setLocalStorage('cart', cart)
}

export default ValidateProductInCart
