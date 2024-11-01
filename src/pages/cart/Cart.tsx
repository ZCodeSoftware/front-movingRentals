import { useState, useEffect } from 'react'
import { fetchCart } from '../../services/cart/cartService'
import { Button } from '@nextui-org/react'
import CartItemList from './components/CartItemsList'
import { ICart } from '../../services/cart/models/cart.interface'

const Cart = () => {
  const [cart, setCart] = useState<ICart>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCart('1')
      setCart(result)
      setLoading(false)
    }

    if (!cart || (cart.products && cart.products.length <= 1)) {
      getData()
    }
  }, [cart])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className='w-full'>
      <h1 className='m-4 text-center text-2xl font-bold'>Cart</h1>
      {cart ? (
        <div className='mx-auto max-w-5xl justify-center md:flex md:space-x-6 xl:px-0 p-4'>
          <section className='rounded-lg md:w-2/3 md:overflow-auto overflow-hidden md:max-h-[80vh]'>
            <CartItemList product={cart.products} />
          </section>
          <section className='mt-6 h-full border p-6 shadow-md md:mt-0 md:w-1/3'>
            <div className='text-center border p-2 mb-2'>
              <h1 className='text-xl font-bold border-b'>Deals</h1>
              <div className='flex flex-row justify-around text-start overflow-x-auto'>
                <p>Deals 1</p>
                <p>Deals 2</p>
              </div>
            </div>
            <div className='border-b'>
              <h2>Subtotal: $123</h2>
              <h2>Taxes: $123</h2>
              <h1 className='mt-3 font-bold'>Total: ${cart.totalPrice}</h1>
            </div>
            <Button className='mt-6 w-full rounded-md py-1.5 font-medium' style={{ marginTop: '1rem' }}>
              Purchase
            </Button>
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
