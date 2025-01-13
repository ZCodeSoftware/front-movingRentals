import { useState } from 'react'
import { Image, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const VehicleDetailComponent = ({ product, setOpenModal }: any) => {
  const [viewMore, setViewMore] = useState(false)
  const { t } = useTranslation()

  return (
    <div className='w-full h-full relative text-white p-8 rounded-lg'>
      <div className='relative z-10 bg-slate-700 p-4 rounded-lg'>
        <h1 className='text-4xl font-bold mb-8'>{product.name}</h1>
        <div className='w-3/5 mb-8'>
          <div className='flex flex-col space-y-4 text-gray-200'>
            <span className='text-lg'>Precio por hora: ${product.price}</span>
            <span className='text-lg'>Precio por 4 horas: ${product.pricePer4}</span>
            <span className='text-lg'>Precio por 8 horas: ${product.pricePer8}</span>
            <span className='text-lg'>Precio por 24 horas: ${product.pricePer24}</span>
            <span className='text-lg'>Capacidad: {product.capacity}</span>
          </div>
        </div>
        <div className={`w-3/5 ${viewMore ? 'max-h-full' : 'max-h-16'} overflow-hidden transition-all`}>
          <p className='break-words whitespace-pre-line text-gray-200'>{product.description}</p>
        </div>

        <span
          onClick={() => setViewMore(!viewMore)}
          className='cursor-pointer text-blue-300 underline mt-2 inline-block'
        >
          {viewMore ? t('Product-detail.view-less') : t('Product-detail.view-more')}
        </span>
      </div>
      <div className='absolute md:top-40 top-16 right-0 w-2/5 h-[300px] z-20'>
        <Image src={product?.images[0] || null} alt='no' className='w-full h-full object-cover rounded-md' />
      </div>
      <div className='mt-8 pt-6 border-t border-gray-600 relative z-10'>
        <div className='flex justify-end gap-4'>
          <Button color='success'>Agregar al carrito</Button>
          <Button color='danger' onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailComponent
