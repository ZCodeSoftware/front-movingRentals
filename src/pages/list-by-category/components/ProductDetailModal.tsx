import { useState } from 'react'
import { Modal, ModalBody, ModalContent, Image, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const ProductDetailModal = ({ product, setOpenModal }: any) => {
  const [viewMore, setViewMore] = useState(false)
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={!!product}
      onClose={() => setOpenModal(false)}
      size='5xl'
      placement='center'
      scrollBehavior='inside'
      className='md:w-2/4 h-auto absolute z-50'
    >
      <ModalContent>
        <ModalBody>
          {product.length > 0 &&
            product.map((prod: any) => (
              <div className='w-full h-full flex flex-col'>
                <h1 className='font-bold p-4 mb-6 text-center'>{prod.name}</h1>
                <div className='w-full flex justify-center items-center gap-4'>
                  <Image
                    src='https://www.motolucero.com.ar/wp-content/uploads/2022/12/portada-cuatri.jpg'
                    alt='no'
                    className='w-full object-contain max-h-[300px]'
                  />
                  <p className='w-2/4'>{prod.specs || null}</p>
                </div>
                <div
                  className={`flex-grow overflow-hidden mt-6 ${
                    viewMore ? 'max-h-full overflow-y-auto' : 'max-h-16 overflow-hidden'
                  } p-4 transition-all`}
                >
                  <p className='break-words whitespace-normal'>{prod.description.repeat(200)}</p>
                </div>
                <span
                  onClick={() => setViewMore(!viewMore)}
                  className='cursor-pointer text-blue-500 underline text-center mt-2'
                >
                  {viewMore ? t('Product-detail.view-less') : t('Product-detail.view-more')}
                </span>
                <div className='border-t border-black w-full p-4'>
                  <div className='flex justify-end gap-4'>
                    <p className='self-center'>$Price</p>
                    <Button color='success'>Agregar al carrito</Button>
                    <Button color='danger' onClick={() => setOpenModal(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProductDetailModal
