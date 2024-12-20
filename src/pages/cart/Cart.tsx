import { useState, useEffect } from 'react'
import { Button } from '@nextui-org/react'
import LocalCartItemList from './components/LocalCartItemsList'
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useTranslation } from 'react-i18next'
import { AppApiGateWay } from '../../services/app.api.gateway'
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service'
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage'
import { setLocalStorage } from '../../utils/local-storage/setLocalStorage'
import { fetchCart } from '../../services/cart/GET/cart.get.service'
import { postCart } from '../../services/cart/POST/cart.post.service'
import { ILocalCart } from './models/local-cart.interface'
import { ISelectItems, ISelectTours, ISelectTransfers } from '../../components/homeRental/models/Select-data'
import BackCartItemList from './components/BackCartListItems'

const Cart = () => {
  const { i18n } = useTranslation()
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR'
  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, { locale })
  const [loading, setLoading] = useState<boolean>(true)
  const [preferenceId, setPreferenceId] = useState(null)
  const [cartVersion, setCartVersion] = useState(0)
  const [userData, setUserData] = useState<any>(null)
  const [localCart, setLocalCart] = useState<ILocalCart>({
    branch: '',
    selectedItems: [],
    selectedTours: [],
    transfer: [],
    travelers: { adults: 0, childrens: 0 }
  })
  const [cartData, setCartData] = useState<null | any>(null)

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userResponse = await fetchUserDetail()
        setUserData(userResponse)

        if (userResponse && userResponse.cart && userResponse.cart) {
          const cartResponse = await fetchCart(userResponse.cart)
          setCartData(cartResponse)
        }
      } catch (error: any) {
        const localCartData = getLocalStorage('cart')
        if (localCartData) {
          setLocalCart(localCartData)
        }
        throw new Error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserAndCart()
  }, [cartVersion])

  console.log(preferenceId)

  const createPreference = async () => {
    try {
      const response = await AppApiGateWay.post('/payments/mercadopago', [
        {
          title: 'Dummy Item',
          description: 'Multicolor Item',
          quantity: 1,
          currency_id: 'MXN',
          unit_price: 100.0
        }
      ])

      setPreferenceId(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const handleBuy = async () => {
    const preferenceId = await createPreference()
    if (preferenceId) {
      setPreferenceId(preferenceId)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      if (getLocalStorage('user') && cartData) {
        const updatedCartVehicles =
          cartData.vehicles.filter((product: ISelectItems) => product.vehicle._id != productId) || []
        const updatedCartTours = cartData.tours.filter((product: ISelectTours) => product.tour._id != productId) || []
        const updateTransfer =
          cartData.transfer.filter((product: ISelectTransfers) => product.transfer._id != productId) || []
        const newCart = {
          ...cartData,
          vehicles: updatedCartVehicles,
          tours: updatedCartTours,
          transfer: updateTransfer
        }

        await postCart({ cart: newCart, userCartId: userData.cart })
        setLocalStorage('backCart', {
          ...localCart,
          selectedItems: updatedCartVehicles,
          selectedTours: updatedCartTours,
          transfer: updateTransfer
        })
        setCartData(newCart)
      } else {
        const updatedCartVehicles = localCart?.selectedItems?.filter(product => product.vehicle._id != productId) || []
        const updatedCartTours = localCart?.selectedTours?.filter(product => product.tour._id != productId) || []
        const updateTransfer = localCart?.transfer?.filter(product => product.transfer._id != productId) || []

        const newCart = {
          ...localCart,
          selectedItems: updatedCartVehicles,
          selectedTours: updatedCartTours,
          transfer: updateTransfer
        }

        setLocalCart(newCart)
        setLocalStorage('cart', newCart)
      }
      setCartVersion(prevVersion => prevVersion + 1)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  const handleRemoveAll = async () => {
    try {
      if (getLocalStorage('user') && cartData) {
        const emptyCart = {
          ...cartData,
          vehicles: [],
          tours: [],
          transfer: []
        }

        await postCart({ cart: emptyCart, userCartId: userData.cart })
        localStorage.removeItem('backCart')
        setCartData(emptyCart)
      } else {
        const emptyCart = {
          ...localCart,
          selectedItems: [],
          selectedTours: [],
          transfer: []
        }

        setLocalCart(emptyCart)
        localStorage.removeItem('cart')
      }
      setCartVersion(prevVersion => prevVersion + 1)
    } catch (error: any) {
      console.error('Error al eliminar todos los productos del carrito:', error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const cart = userData && cartData ? cartData : { products: localCart }

  return (
    <main className='w-full'>
      <h1 className='m-4 text-center text-2xl font-bold'>Cart</h1>
      {cart ? (
        <div className='mx-auto max-w-5xl justify-center md:flex md:space-x-6 xl:px-0 p-4'>
          <div className='md:w-2/3 flex flex-col'>
            <section className='rounded-lg md:overflow-auto overflow-hidden md:max-h-[80vh]'>
              {cartData ? (
                <BackCartItemList product={cartData} handleRemove={handleRemoveItem} />
              ) : (
                <LocalCartItemList product={cart.products} handleRemove={handleRemoveItem} />
              )}
            </section>
            <div className='w-full flex justify-end md:justify-start'>
              <button onClick={handleRemoveAll} className='max-w-28 p-2'>
                Remove all
              </button>
            </div>
          </div>
          <section className='mt-6 h-full md:mt-0 md:w-1/3 bg-transparent'>
            <div className='text-center p-4 mb-6'>
              <h1 className='text-xl font-bold border-b'>Deals</h1>
              <div className='flex flex-row justify-around text-start overflow-x-auto border rounded-md p-4'>
                <p>Deals 1</p>
                <p>Deals 2</p>
              </div>
            </div>
            <div className='p-4 border border-b-0 rounded-md rounded-b-none mt-6'>
              <h2>Subtotal: $123</h2>
              <h2>Taxes: $123</h2>
              <h1 className='mt-6 font-bold'>Total: ${cart.totalPrice}</h1>
            </div>
            <Button
              onPress={handleBuy}
              className='w-full rounded-md font-semibold text-xl border rounded-t-none bg-buttonPrimary p-6'
            >
              Purchase
            </Button>
            {preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
          </section>
        </div>
      ) : (
        <div className='flex justify-center w-full'>
          <h1 className='rounded-lg border p-6'>Tu carrito está vacío</h1>
        </div>
      )}
    </main>
  )
}

export default Cart
