import { useState } from 'react'
import { Card, CardFooter, Image } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ProductDetailModal from '../../list-by-category/components/ProductDetailModal'

const HomeCards = ({ items }: any) => {
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const { t } = useTranslation()
  console.log(items)
  return (
    <div className='scroll-container flex space-x-4 overflow-x-auto md:overflow-visible w-full md:justify-center'>
      {items.length > 0 ? (
        items.map((i: any) => (
          <>
            {!i.hasOwnProperty('estimatedDuration') && !i.hasOwnProperty('cenotePrice') ? (
              <Card key={i._id} className='flex-none w-72 mx-2'>
                <Link to={`/list-by-category/${i._id}`}>
                  <Card radius='none' className='h-full' isPressable>
                    <Image
                      alt={i.name}
                      sizes='200px'
                      className=' object-cover'
                      radius='none'
                      src={i.image || null}
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
                    src={i.images[0] || null}
                    width='100%'
                  />
                  <CardFooter className='justify-center backdrop-blur-sm rounded-b-lg bg-backgroundWhite bg-opacity-60 border-white/80 border-t overflow-hidden absolute bottom-0 w-full z-10 p-1'>
                    <p className='text-black font-semibold'>{i.name}</p>
                  </CardFooter>
                </Card>
              </Card>
            )}
            {openDetailModal && <ProductDetailModal product={i} setOpenModal={setOpenDetailModal} />}
          </>
        ))
      ) : (
        <p>{t('homePage.no_products_available')}</p>
      )}
    </div>
  )
}

export default HomeCards
