// components/Hero.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const Hero: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className='relative w-full h-[100vh] overflow-hidden flex items-center justify-center'>
      <video
        className='absolute top-0 left-0 w-full h-full object-cover'
        src='https://res.cloudinary.com/dkghppaza/video/upload/v1730200724/tulum_iks58w.mp4'
        autoPlay
        loop
        muted
      />
      <div className='absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white p-4'>
        <h1 className='text-4xl md:text-6xl font-bold mb-4'>{t('landingPage.hero_title')}</h1>
        <p className='text-lg md:text-2xl mb-8'>{t('landingPage.hero_subtitle')}</p>
        <button className='bg-yellow-500 text-black px-6 py-3 rounded-md text-lg md:text-xl font-semibold'>
          <Link to='/home'>{t('landingPage.hero_button')}</Link>
        </button>
      </div>
    </div>
  )
}

export default Hero
