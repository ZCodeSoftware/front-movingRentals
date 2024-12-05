import { useState } from 'react'
import { Image } from '@nextui-org/react'
import { removeCartItem } from '../../../services/cart/cartService'
import trashIcon from '../../../assets/SVG/trash-icon.svg'

const CartItemList = ({ product }: any) => {
  const [productList, setProductList] = useState(product)

  const handleRemove = async (id: string) => {
    const newCart = await removeCartItem(id)
    setProductList(newCart.products)
  }

  return (
    <>
      {productList &&
        productList.map((p: any, index: number) => {
          return (
            <div key={index} className='flex justify-between mb-6 p-4 shadow-md border'>
              <div className='flex pr-4'>
                <Image
                  src={p.image}
                  alt='product-image'
                  radius='none'
                  className='w-40 h-24 object-contain border p-2'
                />
                <div className='ml-2 flex flex-col'>
                  <div>
                    <h2 className='text-sm font-bold mb-1'>{p.name}</h2>
                    <p className='text-sm'>Subtotal: ${p.price}</p>
                  </div>
                  <div className='flex flex-col'></div>
                </div>
              </div>
              <div className='flex flex-col justify-end items-end'>
                <button onClick={() => handleRemove(p._id)}>
                  <Image src={trashIcon}></Image>
                </button>
              </div>
            </div>
          )
        })}
    </>
  )
}

export default CartItemList
