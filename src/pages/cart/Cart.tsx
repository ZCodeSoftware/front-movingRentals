import { useState, useEffect } from 'react';
import { fetchCart } from '../../services/cart/cartService';
import { Button } from '@nextui-org/react';
import CartItemList from './components/CartItemsList';
import { ICart } from '../../services/cart/models/cart.interface';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useTranslation } from 'react-i18next';
import { AppApiGateWay } from '../../services/app.api.gateway';


const Cart = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'en' ? 'en-US' : 'es-AR';
  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY, { locale });
  const [cart, setCart] = useState<ICart>();
  const [loading, setLoading] = useState<boolean>(true);
  const [preferenceId, setPreferenceId] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCart('1');
      setCart(result);
      setLoading(false);
    };

    if (!cart || (cart.products && cart.products.length <= 1)) {
      getData();
    }
  }, [cart]);

  console.log(preferenceId);


  const createPreference = async () => {
    try {
      const response = await AppApiGateWay.post('/payments/mercadopago',
        [{
          title: 'Dummy Item',
          description: 'Multicolor Item',
          quantity: 1,
          currency_id: 'MXN',
          unit_price: 100.0,
        }]
      );

      setPreferenceId(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const handleBuy = async () => {
    const preferenceId = await createPreference();
    if (preferenceId) {
      setPreferenceId(preferenceId);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className='w-full'>
      <h1 className='m-4 text-center text-2xl font-bold'>Cart</h1>
      {cart ? (
        <div className='mx-auto max-w-5xl justify-center md:flex md:space-x-6 xl:px-0 p-4'>
          <div className='md:w-2/3 flex flex-col'>
            <section className='rounded-lg md:overflow-auto overflow-hidden md:max-h-[80vh]'>
              <CartItemList product={cart.products} />
            </section>
            <div className='w-full flex justify-end md:justify-start'>
              <button className='max-w-28 p-2'>Remove all</button>
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
  );
};

export default Cart;