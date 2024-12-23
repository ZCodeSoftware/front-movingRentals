import { Image } from '@nextui-org/react'
import logo from '../../../../assets/PNG/Isologo.png'
import { useTranslation } from 'react-i18next'

const DashboardHome = () => {
  const { t } = useTranslation()
  return (
    <div className='w-full h-screen flex flex-col justify-start items-center overflow-y-hidden'>
      <Image src={logo} alt='logo' />
      <h1 className='text-xl'>Experience & Rentals</h1>
      <p className='text-sm'>{t('Dashboard.dashboard-home-eslogan')}</p>
    </div>
  )
}

export default DashboardHome
