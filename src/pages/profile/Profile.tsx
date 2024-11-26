import { Button, Input } from '@nextui-org/react'
import ReservationsModal from './components/ReservationsModal'
import { useTranslation } from 'react-i18next'

const Profile = () => {
  const { t } = useTranslation()

  return (
    <main className='w-full h-screen flex flex-col justify-center items-center p-4'>
      <h1 className='text-2xl p-4'>{t('Profile.title')}</h1>
      <div className='md:w-2/5 h-full'>
        <section className='w-full h-2/4 flex flex-col justify-evenly md:flex-row md:justify-between items-center'>
          <Input
            isReadOnly
            disableAnimation
            data-hover='false'
            placeholder='Mail'
            defaultValue='Mail'
            className='md:w-2/4 cursor-default'
            endContent={<Button>Edit</Button>}
          />
          <ReservationsModal />
        </section>
        <section className='w-full h-2/4 flex flex-col md:flex-row md:justify-between items-center md:items-start'>
          <Button className='w-48'>{t('Profile.change_password')}</Button>
          <Button className='w-48 my-6 md:my-0 md:mx-6'>{t('Profile.log_out')}</Button>
          <Button className='w-48' color='danger'>
            {t('Profile.delete_account')}
          </Button>
        </section>
      </div>
    </main>
  )
}

export default Profile
