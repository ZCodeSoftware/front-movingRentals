import { useState } from 'react'
import { Image, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const TourDetailComponent = ({ product, setOpenModal }: any) => {
  const [viewMore, setViewMore] = useState(false)
  const { t } = useTranslation()

  return (
    <div className='w-full h-full flex flex-col overflow-hidden'>
      <h1 className='font-bold p-4 mb-6 text-center'>{product.name}</h1>
      <div className='w-full flex justify-center items-center gap-4'>
        <Image
          src={product?.images[0] || null}
          alt='no'
          sizes='200px'
          className='w-full object-contain max-h-[300px]'
        />
        <div className='flex flex-col space-y-4'>
          <span>Precio: ${product.price}</span>
          <span>Duración estimada: {product.estimatedDuration}</span>
          <span>Horas de inicio: {product.startDates}</span>
          <span>Capacidad: {product.capacity}</span>
        </div>
      </div>
      <div
        className={`flex-grow overflow-hidden mt-6 ${
          viewMore ? 'max-h-full overflow-y-auto' : 'max-h-16 overflow-hidden'
        } p-4 transition-all mb-4`}
      >
        <p className='break-wordsbreak-words whitespace-pre-line'>{JSON.parse(product.description)}</p>
        <br />
        <p className='break-wordsbreak-words whitespace-pre-line'>{JSON.parse(product.itinerary)}</p>
      </div>
      <span onClick={() => setViewMore(!viewMore)} className='cursor-pointer text-blue-500 underline text-center mt-2'>
        {viewMore ? t('Product-detail.view-less') : t('Product-detail.view-more')}
      </span>
      <div className='border-t border-black w-full p-4'>
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

export default TourDetailComponent
