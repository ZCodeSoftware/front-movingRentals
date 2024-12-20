import { useState } from 'react'
import { ISelectItems, ISelectTours, ISelectTransfers } from '../../../components/homeRental/models/Select-data'
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage'
import { postCart } from '../../../services/cart/POST/cart.post.service'
import { fetchCart } from '../../../services/cart/GET/cart.get.service'

const useMergeCarts = () => {
  const [isMerging, setIsMerging] = useState(false)

  const mergeCarts = async (userCartId: string) => {
    setIsMerging(true)
    const userCart = await fetchCart(userCartId)
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
                      item.dates.start.minute,
                      item.dates.start.second,
                      item.dates.start.millisecond
                    ).toISOString()
                  : null,
                end: item.dates.end
                  ? new Date(
                      item.dates.end.year,
                      item.dates.end.month - 1,
                      item.dates.end.day,
                      item.dates.end.hour,
                      item.dates.end.minute,
                      item.dates.end.second,
                      item.dates.end.millisecond
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
                item.date.minute,
                item.date.second,
                item.date.millisecond
              ).toISOString()
            : null,
          transfer: item.transfer._id ? item.transfer._id : null
        }))

        const filteredItems = formattedItems.filter((localItem: ISelectItems) =>
          userCart.vehicles.every((userItem: any) => userItem._id != localItem.vehicle._id)
        )
        const filteredTours = formattedTours.filter((localTour: ISelectTours) =>
          userCart.tours.every((userTour: any) => userTour._id != localTour.tour._id)
        )
        const filteredTransfers = formattedTransfers.filter((localTransfer: ISelectTransfers) =>
          userCart.transfer.every((userTransfer: any) => userTransfer._id != localTransfer.transfer._id)
        )

        const combinedItems = [...userCart.vehicles, ...filteredItems]
        const combinedTours = [...userCart.tours, ...filteredTours]
        const combinedTransfers = [...userCart.transfer, ...filteredTransfers]

        const productsToBack = {
          branch: localCart.branch || userCart.branch,
          transfer: combinedTransfers,
          travelers: localCart.travelers || userCart.travelers,
          selectedItems: combinedItems,
          selectedTours: combinedTours
        }

        if (combinedItems.length > 0 || combinedTours.length > 0 || combinedTransfers.length > 0) {
          await postCart({ cart: productsToBack, userCartId })
        }

        localStorage.removeItem('cart')
      } catch (error: any) {
        console.error('Error al formatear los datos del carrito:', error)
      } finally {
        setIsMerging(false)
      }
    }
  }

  return { isMerging, mergeCarts }
}

export default useMergeCarts
