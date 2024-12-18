import { useState, useEffect } from 'react'
import { fetchCategories } from '../../services/categories/categoriesService'
import { ICategories } from '../../services/categories/models/categories.interface'
import i18n from 'i18next'
import ImageSlider from '../../components/imageSlider/ImageSlider'
import { images } from '../../mocks/imageSliderHome'
import HomeRental from '../../components/homeRental/HomeRental'
import HomeCards from './components/HomeCards'
import { motion } from 'framer-motion'
import { FaCloud, FaSun, FaCloudRain, FaSnowflake, FaSmog } from 'react-icons/fa'
import { fetchAllTours } from '../../services/products/tours/GET/tours.get.service'
import { ITours } from '../../services/products/models/tours.interface'

const Home = () => {
  const [data, setData] = useState<ICategories[]>([])
  const [toursData, setToursData] = useState<ITours[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  interface WeatherData {
    main: {
      temp: number
      humidity: number
    }
    weather: {
      main: string
      description: string
    }[]
  }

  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const getData = async () => {
      const resultCategories = await fetchCategories()
      const resultTours = await fetchAllTours()
      setData(resultCategories)
      setToursData(resultTours)
      setLoading(false)
    }

    getData()
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const units = i18n.language === 'en' ? 'imperial' : 'metric'
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Tulum,mx&units=${units}&appid=${
            import.meta.env.VITE_WEATHER_API_KEY
          }&lang=${i18n.language}`
        )
        const weatherData = await response.json()
        setWeather(weatherData)
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
    }

    fetchWeather()
  }, [i18n.language])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Clear':
        return <FaSun className='text-yellow-400 text-4xl' />
      case 'Clouds':
        return <FaCloud className='text-gray-400 text-4xl' />
      case 'Rain':
        return <FaCloudRain className='text-blue-500 text-4xl' />
      case 'Snow':
        return <FaSnowflake className='text-blue-200 text-4xl' />
      case 'Smoke':
      case 'Haze':
      case 'Mist':
        return <FaSmog className='text-gray-500 text-4xl' />
      default:
        return <FaCloud className='text-gray-400 text-4xl' />
    }
  }

  const getTemperatureUnit = () => {
    return i18n.language === 'en' ? '°F' : '°C'
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className='w-full bg-backgroundWhite'>
      <div
        className='absolute top-0 left-0 w-full h-96 object-cover bg-top'
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      ></div>
      <div className='block md:sticky top-16 z-20'>
        <HomeRental categoriesData={data} />
      </div>

      {weather && (
        <motion.div
          className='fixed bottom-14 right-6 hidden bg-white bg-opacity-40 backdrop-blur-lg p-4 rounded-full shadow-lg cursor-pointer sm:flex items-center space-x-3 hover:bg-opacity-80 z-50'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {getWeatherIcon(weather.weather[0].main)}
          <div>
            <p className='font-semibold text-gray-800'>Tulum MX</p>
            <p className='text-gray-600 text-sm'>{`${weather.main.temp} ${getTemperatureUnit()}`}</p>
          </div>
        </motion.div>
      )}

      <motion.section
        className='flex flex-col md:items-center md:mt-24'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='w-full flex flex-col items-start justify-start p-6'>
          <h1 className='text-xl mb-2'>Vehicles</h1>
          <div className='flex w-full mx-auto overflow-x-auto'>
            <div className='flex space-x-4 md:space-x-6 w-max'>
              <HomeCards items={data.filter(v => v.disclaimer && v)} />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className='flex flex-col items-center'
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className='w-full flex flex-col items-start justify-start p-6'>
          <h1 className='text-xl mb-2'>Tours</h1>
          <div className='flex space-x-4 md:space-x-6 w-max'>
            <HomeCards items={toursData} />
          </div>
        </div>
      </motion.section>

      <motion.section
        className='flex justify-center p-2 w-full h-auto'
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <ImageSlider images={images} autoplay={true} className='bg-backgroundWhite' />
      </motion.section>
    </main>
  )
}

export default Home
