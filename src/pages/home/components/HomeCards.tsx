import { Card, CardFooter, Image } from '@nextui-org/react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { IHomeCardProps } from '../models/home-cards-props'

const HomeCards = ({ items }: IHomeCardProps) => {
  const { t } = useTranslation()
  return (
    <div className='flex space-x-4 overflow-x-auto md:overflow-visible w-full md:justify-center'>
      {items.length > 0 ? (
        items.map(i => (
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
                <CardFooter className='justify-center before:bg-white/10 bg-gray-400 bg-opacity-30 border-white/80 border-1 overflow-hidden absolute before:rounded-xl bottom-0 w-full shadow-small z-10'>
                  <p className='text-white/80 font-black'>{i.name}</p>
                </CardFooter>
              </Card>
            </Link>
          </Card>
        ))
      ) : (
        <p>{t('homePage.no_products_available')}</p>
      )}
    </div>
  )
}

export default HomeCards
