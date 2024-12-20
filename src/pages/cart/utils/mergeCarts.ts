import { useState } from 'react'
import { postCart } from '../../../services/cart/POST/cart.post.service'
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage'
import { ISelectItems, ISelectTours, ISelectTransfers } from '../../../components/homeRental/models/Select-data'

const useMergeCarts = () => {
  const [isMerging, setIsMerging] = useState(false)

  const mergeCarts = async (userCartId: string) => {
    setIsMerging(true)
    const localCart = getLocalStorage('cart')
    if (localCart) {
      try {
        const formattedItems = localCart.selectedItems.map((item: ISelectItems) => ({
          ...item,
          dates: item.dates
            ? {
                start: item.dates.start
                  ? new Date(
                      item.dates.start.year,
                      item.dates.start.month - 1,
                      item.dates.start.day,
                      item.dates.start.hour,
                      item.dates.start.minute
                    ).toISOString()
                  : null,
                end: item.dates.end
                  ? new Date(
                      item.dates.end.year,
                      item.dates.end.month - 1,
                      item.dates.end.day,
                      item.dates.end.hour,
                      item.dates.end.minute
                    ).toISOString()
                  : null
              }
            : null,
          vehicle: item.vehicle ? item.vehicle._id : null,
          total: item.total
        }))

        const formattedTours = localCart.selectedTours.map((item: ISelectTours) => ({
          ...item,
          date: item.date ? new Date(item.date.year, item.date.month - 1, item.date.day).toISOString() : null,
          tour: item.tour ? item.tour._id : null
        }))

        const formattedTransfers = localCart.transfer.map((item: ISelectTransfers) => ({
          ...item,
          date: item.date
            ? new Date(
                item.date.year,
                item.date.month - 1,
                item.date.day,
                item.date.hour,
                item.date.minute
              ).toISOString()
            : null,
          transfer: item.transfer._id ? item.transfer._id : null
        }))

        const productsToBack = {
          branch: localCart.branch,
          transfer: formattedTransfers,
          travelers: localCart.travelers,
          selectedItems: formattedItems,
          selectedTours: formattedTours
        }

        if (formattedItems || formattedTours || formattedTransfers) {
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
