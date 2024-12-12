import { useState } from 'react'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductDetailModal from '../../list-by-category/components/ProductDetailModal'
import { HOME_CARDS_CONSTANTS } from '../constants/home.constants'

const HomeCards = ({ items }: any) => {
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const { t } = useTranslation()

  return (
    <div className='flex space-x-4 overflow-x-auto md:overflow-visible w-full md:justify-center'>
      {items.length > 0 ? (
        items.map((i: any) => (
          <>
            {!i.hasOwnProperty(HOME_CARDS_CONSTANTS.INCLUDES) ? (
              <Card key={i._id} className='flex-none w-72 mx-2'>
                <Link to={`/list-by-category/${i._id}`}>
                  <Card radius='none' className='h-full' isPressable>
                    <Image
                      alt={i.name}
                      sizes='200px'
                      className=' object-cover'
                      radius='none'
                      src={i.image || 'https://www.motolucero.com.ar/wp-content/uploads/2022/12/portada-cuatri.jpg'}
                      width='100%'
                    />
                    <CardFooter className='justify-center backdrop-blur-sm rounded-b-lg bg-backgroundWhite bg-opacity-60 border-white/80 border-t overflow-hidden absolute bottom-0 w-full z-10 p-1'>
                      <p className='text-black font-semibold'>{i.name}</p>
                    </CardFooter>
                  </Card>
                </Link>
              </Card>
            ) : (
              <Card key={i._id} className='flex-none w-72 mx-2'>
                <Card
                  radius='none'
                  className='h-full'
                  isPressable
                  onPress={() => {
                    setOpenDetailModal(true)
                  }}
                >
                  <Image
                    alt={i.name}
                    sizes='200px'
                    className=' object-cover'
                    radius='none'
                    src={i.image || 'https://www.motolucero.com.ar/wp-content/uploads/2022/12/portada-cuatri.jpg'}
                    width='100%'
                  />
                  <CardFooter className='justify-center backdrop-blur-sm rounded-b-lg bg-backgroundWhite bg-opacity-60 border-white/80 border-t overflow-hidden absolute bottom-0 w-full z-10 p-1'>
                    <p className='text-black font-semibold'>{i.name}</p>
                  </CardFooter>
                </Card>
              </Card>
            )}
          </>
        ))
      ) : (
        <p>{t('homePage.no_products_available')}</p>
      )}
      {openDetailModal && <ProductDetailModal product={items} setOpenModal={setOpenDetailModal} />}
    </div>
  )
}

export default HomeCards
