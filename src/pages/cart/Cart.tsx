import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Spinner } from '@nextui-org/react'
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
import CryptoJS from 'crypto-js'
import LoaderComponent from '../../utils/loader'
import useCartStore from '../../store/cart.store'

const Cart = () => {
  const { i18n, t } = useTranslation()
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR'
  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, { locale })
  const [loading, setLoading] = useState<boolean>(true)
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false) // Estado para el loading de la compra
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
  const [tyc, setTyc] = useState<boolean>(false)
  const [cartData, setCartData] = useState<null | any>(null)
  const { setCartItems } = useCartStore()

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const userResponse = await fetchUserDetail()
        setUserData(userResponse)

        if (userResponse && userResponse.cart) {
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

  let totalPrice = 0

  const cartItemsVehicles =
    cartData?.vehicles.map((product: ISelectItems) => {
      totalPrice += product.total || 0
      return {
        title: product.vehicle.name,
        description: product.vehicle.name + ' Rental',
        quantity: 1,
        currency_id: 'MXN',
        unit_price: product.total
      }
    }) || []

  const cartItemsTours =
    cartData?.tours.map((product: ISelectTours) => {
      totalPrice += product.tour.price || 0
      return {
        title: product.tour.name,
        description: product.tour.name + ' Tour',
        quantity: 1,
        currency_id: 'MXN',
        unit_price: product.tour.price
      }
    }) || []

  const cartItemsTransfers =
    cartData?.transfer.map((product: ISelectTransfers) => {
      totalPrice += product.transfer.price || 0
      return {
        title: product.transfer.name,
        description: product.transfer.name + ' Transfer',
        quantity: 1,
        currency_id: 'MXN',
        unit_price: product.transfer.price
      }
    }) || []

  const createPreference = async () => {
    try {
      const uuid = uuidv4()
      const encryptedUUID = CryptoJS.AES.encrypt(uuid, 'secret-key').toString()
      setLocalStorage('paymentToken', encryptedUUID)

      const response = await AppApiGateWay.post('/payments/mercadopago', {
        items: [...cartItemsVehicles, ...cartItemsTours, ...cartItemsTransfers].flat(),
        back_urls: {
          success: `${window.location.origin}/successPayment?successPayment=true&token=${encodeURIComponent(
            encryptedUUID
          )}`,
          failure: `${window.location.origin}/successPayment?successPayment=false&token=${encodeURIComponent(
            encryptedUUID
          )}`,
          pending: `${window.location.origin}/successPayment?successPayment=false&token=${encodeURIComponent(
            encryptedUUID
          )}`
        },
        auto_return: 'approved'
      })

      setPreferenceId(response.data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  }

  const handleBuy = async () => {
    setPurchaseLoading(true) // Inicia el loading de la compra
    const preferenceId = await createPreference()
    if (preferenceId) {
      setPreferenceId(preferenceId)
    }
    setPurchaseLoading(false) // Termina el loading de la compra
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      if (getLocalStorage('user') && cartData) {
        
        const updatedCartVehicles = cartData.vehicles?.filter((product: ISelectItems) => product.vehicle._id != productId) || []
        const updatedCartTours = cartData.tours?.filter((product: ISelectTours) => product.tour._id != productId) || []
        const updateTransfer = cartData.transfer?.filter((product: ISelectTransfers) => product.transfer._id != productId) || []
        const newCart = {
          ...cartData,
          selectedItems: updatedCartVehicles.map((product: ISelectItems) => ({
            ...product,
            vehicle: product.vehicle._id
          })),
          selectedTours: updatedCartTours.map((product: ISelectTours) => ({
            ...product,
            tour: product.tour._id
          })),
          transfer: updateTransfer.map((product: ISelectTransfers) => ({
            ...product,
            transfer: product.transfer._id
          }))
        }
        console.log('newCart', newCart);
        
        await postCart({ cart: newCart, userCartId: userData.cart })
        setLocalStorage('backCart', {
          ...localCart,
          selectedItems: updatedCartVehicles,
          selectedTours: updatedCartTours,
          transfer: updateTransfer
        })
        setCartData(newCart)
        const totalItems = updatedCartVehicles.length + updatedCartTours.length + updateTransfer.length
        setCartItems(totalItems)
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
        const totalItems = updatedCartVehicles.length + updatedCartTours.length + updateTransfer.length
        setCartItems(totalItems)

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
        setCartItems(0)
        setLocalCart(emptyCart)
        localStorage.removeItem('cart')
      }
      setCartVersion(prevVersion => prevVersion + 1)
    } catch (error: any) {
      console.error('Error al eliminar todos los productos del carrito:', error)
    }
  }

  if (loading) {
    return <LoaderComponent />
  }

  const handleTycChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTyc(event.target.checked);
  };
  
  const cart = userData && cartData ? cartData : { products: localCart }
  const itemsInCart = cartData ? cartData.vehicles.length + cartData.tours.length + cartData.transfer.length : localCart.selectedItems.length + localCart.selectedTours.length + localCart.transfer.length

  
  return (
    <main className='w-full'>
      <h1 className='m-4 text-center text-2xl font-bold'>{t("cart.cart")}</h1>
      {itemsInCart ? (
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
                {t("cart.removeAll")}
              </button>
            </div>
          </div>
          <section className='mt-6 h-full md:mt-0 md:w-1/3 bg-transparent'>
            <div className='p-4 border border-b-0 rounded-md rounded-b-none mt-6'>
              <h1 className='mt-6 font-bold'>Total: ${totalPrice}</h1>
              <div className='flex mt-6'>
                <input
                id='terms'
                type='checkbox'
                className='mr-2'
                checked={tyc}
                onChange={handleTycChange}
                />
                <label htmlFor='terms' className=''>{t("cart.tyc")}</label>

              </div>
            </div>
            <Button
              onPress={handleBuy}
              className='w-full rounded-md font-semibold text-xl border rounded-t-none bg-buttonPrimary p-6'
              isDisabled={purchaseLoading || !tyc} // Deshabilita el botón mientras se está cargando la compra
            >
              {purchaseLoading ? <Spinner color='primary' size='sm' /> : 'Purchase'}
            </Button>
            {tyc && preferenceId && <Wallet initialization={{ preferenceId: preferenceId }} />}
          </section>
        </div>
      ) : (
        <div className='flex justify-center w-full'>
          <h3 className='rounded-lg border p-6'>{t("cart.emptyCart")}</h3>
        </div>
      )}
    </main>
  )
}

export default Cart
