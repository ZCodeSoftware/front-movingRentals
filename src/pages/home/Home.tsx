import { useState, useEffect } from 'react'
import { fetchCategories } from '../../services/categories/categoriesService'
import { ICategories } from '../../services/categories/models/categories.interface'
import { useTranslation } from 'react-i18next'
import ImageSlider from '../../components/imageSlider/ImageSlider'
import { images } from '../../mocks/imageSliderHome'
import RentalSearch from '../../components/rentalSearch/RentalSearch'
import HomeCards from './components/HomeCards'

const Home = () => {
  const [data, setData] = useState<ICategories[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { t } = useTranslation()

  useEffect(() => {
    const getData = async () => {
      const result = await fetchCategories()
      setData(result)
      setLoading(false)
    }

    getData()
  }, [])

  const vehicles = data.filter(v => v._id != '6')
  const tours = data.filter(t => t._id === '6')

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className='w-full'>
      <div className='relative hidden md:block '>
        <div
          className='absolute top-0 left-0 w-full h-80 object-cover bg-top'
          style={{
            backgroundImage:
              'url(https://plus.unsplash.com/premium_photo-1669748157617-a3a83cc8ea23?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHVlc3RhJTIwZGUlMjBzb2wlMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D)'
          }}
        ></div>
      </div>
      <div className='block md:sticky top-16 z-20'>
        <RentalSearch categoriesData={data} />
      </div>
      <section className='flex flex-col md:items-center md:mt-24'>
        <div className='p-6'>
          <h1 className='text-xl mb-2'>Vehicles</h1>
          <div className='flex w-full mx-auto overflow-x-auto'>
            <div className='flex space-x-4 md:space-x-6 w-max'>
              <HomeCards items={vehicles} />
            </div>
          </div>
        </div>
      </section>
      <section className='flex flex-col items-center'>
        <div className='p-6'>
          <h1 className='text-xl mb-2'>Tours</h1>
          <div className='flex space-x-4 md:space-x-6 w-max'>
            <HomeCards items={tours} />
          </div>
        </div>
      </section>
      <section className='flex justify-center flex-wrap p-6'>
        <div className='flex flex-col md:flex-row items-center justify-evenly w-full'>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
          <div className='p-2'>
            <h1>{t('homePage.home')}</h1>
            <p>{t('homePage.home')}</p>
          </div>
        </div>
      </section>
      <section className='flex justify-center p-2 w-full h-auto'>
        <ImageSlider images={images} autoplay={false} />
      </section>
    </main>
  )
}

export default Home
