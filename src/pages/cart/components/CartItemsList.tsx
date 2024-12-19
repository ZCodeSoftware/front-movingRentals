import { Image } from '@nextui-org/react'
import trashIcon from '../../../assets/SVG/trash-icon.svg'
import { ISelectItems, ISelectTours } from '../../../components/homeRental/models/Select-data'
import { ITransfers } from '../../../services/transfers/models/transfers.interface'

const CartItemList = ({ product, handleRemove }: any) => {
  return (
    <>
      {product &&
        product.selectedItems.map((p: ISelectItems) => (
          <div className='flex justify-between mb-6 p-4 shadow-md border'>
            <div className='flex pr-4'>
              <Image
                src={p.vehicle.images[0]}
                alt='product-image'
                radius='none'
                className='w-40 h-24 object-contain border p-2'
              />
              <div className='ml-2 flex flex-col'>
                <div>
                  <h2 className='text-sm font-bold mb-1'>{p.vehicle.name}</h2>
                  <p className='text-sm'>Subtotal: ${p.total}</p>
                </div>
                <div className='flex flex-col'></div>
              </div>
            </div>
            <div className='flex flex-col justify-end items-end'>
              <button onClick={() => handleRemove(p.vehicle._id)}>
                <Image src={trashIcon}></Image>
              </button>
            </div>
          </div>
        ))}
      {product &&
        product.selectedTours.map((p: ISelectTours) => (
          <div className='flex justify-between mb-6 p-4 shadow-md border'>
            <div className='flex pr-4'>
              <Image
                src={p.tour.images[0]}
                alt='product-image'
                radius='none'
                className='w-40 h-24 object-contain border p-2'
              />
              <div className='ml-2 flex flex-col'>
                <div>
                  <h2 className='text-sm font-bold mb-1'>{p.tour.name}</h2>
                  <p className='text-sm'>Subtotal: ${p.tour.price}</p>
                </div>
                <div className='flex flex-col'></div>
              </div>
            </div>
            <div className='flex flex-col justify-end items-end'>
              <button onClick={() => handleRemove(p.tour._id)}>
                <Image src={trashIcon}></Image>
              </button>
            </div>
          </div>
        ))}
      {product &&
        product.transfer.map((p: ITransfers) => (
          <div className='flex justify-between mb-6 p-4 shadow-md border'>
            <div className='flex pr-4'>
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
        ))}
    </>
  )
}

export default CartItemList
