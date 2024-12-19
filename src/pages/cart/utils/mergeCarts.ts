import { useState } from 'react'
import { postCart } from '../../../services/cart/POST/cart.post.service'
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage'
import { ISelectItems, ISelectTours } from '../../../components/homeRental/models/Select-data'

const useMergeCarts = () => {
  const [isMerging, setIsMerging] = useState(false)

  const mergeCarts = async (userCartId: string) => {
    setIsMerging(true)
    const localCart = getLocalStorage('cart')
    if (localCart.length > 0) {
      try {
        const formattedItems = localCart.selectedItems.map((item: ISelectItems) => ({
          ...item,
          dates: item.dates
            ? {
                start: item.dates.start ? item.dates.start.toDate().toISOString() : null,
                end: item.dates.end ? item.dates.end.toDate() : null
              }
            : null,
          vehicle: item.vehicle ? item.vehicle._id : null,
          total: item.total
        }))

        const formattedTours = localCart.selectedTours.map((item: ISelectTours) => ({
          ...item,
          date: item.date ? item.date.toString() : null,
          tour: item.tour ? item.tour._id : null
        }))
        const productsToBack = localCart.map((item: any) => ({
          branch: item.branch,
          transfer: item.transfer,
          travelers: item.travelers,
          selectedItems: formattedItems,
          selectedTours: formattedTours
        }))

        if (formattedItems || formattedTours || productsToBack.transfer.lenght > 0) {
          await postCart({ cart: productsToBack, userCartId })
        }

        localStorage.removeItem('cart')
      } catch (error: any) {
        throw new Error(error)
      }
    } else localStorage.removeItem('cart')
    setIsMerging(false)
  }

  return { mergeCarts, isMerging }
}

export default useMergeCarts
