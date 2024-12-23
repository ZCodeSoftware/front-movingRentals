import { useState, useEffect } from 'react'
import { Button, Input } from '@nextui-org/react'
import ReservationsModal from './components/ReservationsModal'
import { useTranslation } from 'react-i18next'
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service'
import { IUser } from '../../services/users/models/user.interface'
import UpdateFieldModal from './components/UpdateModal'
import ChangePasswordModal from './components/ChangePasswordModal'

const Profile = () => {
  const { t } = useTranslation()
  const [userData, setUserData] = useState<IUser>()
  const [passwordModal, setPasswordModal] = useState(false)

  const getUserData = async () => {
    const response = await fetchUserDetail()
    if (response) {
      setUserData(response)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <main className='w-full h-screen flex flex-col justify-center items-center p-4 bg-backgroundWhite'>
      <h1 className='text-2xl p-4 font-bold'>{t('Profile.title')}</h1>
      <div className='md:w-2/5 w-full h-full'>
        {userData && (
          <>
            <section className='w-full md:h-2/4 flex flex-col justify-evenly items-center my-4'>
              <div className='grid md:grid-cols-2 md:grid-rows-2 w-full gap-6 md:gap-12 my-4'>
                <Input
                  isReadOnly
                  disableAnimation
                  placeholder={t('Profile.place-holders.name')}
                  value={userData.name || ''}
                  className='bg-transparent focus:outline-none focus:ring-0 pointer-events-none'
                  endContent={
                    <button
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className='pointer-events-auto'
                    >
                      <UpdateFieldModal
                        onUpdate={getUserData}
                        updateType='name'
                        currentValue={userData.name || ''}
                        label={t('Profile.labels.edit-name')}
                        placeholder={t('Profile.place-holders.edit-name')}
                      />
                    </button>
                  }
                />
                <Input
                  isReadOnly
                  disableAnimation
                  placeholder={t('Profile.place-holders.lastname')}
                  value={userData.lastName || ''}
                  className='bg-transparent focus:outline-none focus:ring-0 pointer-events-none'
                  endContent={
                    <button
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className='pointer-events-auto'
                    >
                      <UpdateFieldModal
                        onUpdate={getUserData}
                        updateType='lastName'
                        currentValue={userData.lastName || ''}
                        label={t('Profile.labels.edit-lastname')}
                        placeholder={t('Profile.place-holders.edit-lastname')}
                      />
                    </button>
                  }
                />
                <Input
                  isReadOnly
                  disableAnimation
                  placeholder={t('Profile.place-holders.email')}
                  value={userData.email || ''}
                  className='bg-transparent focus:outline-none focus:ring-0 pointer-events-none'
                  endContent={
                    <button
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className='pointer-events-auto'
                    >
                      <UpdateFieldModal
                        onUpdate={getUserData}
                        updateType='email'
                        currentValue={userData.email || ''}
                        label={t('Profile.labels.edit-email')}
                        placeholder={t('Profile.place-holders.edit-email')}
                      />
                    </button>
                  }
                />
                <Input
                  isReadOnly
                  disableAnimation
                  placeholder={t('Profile.place-holders.cellphone')}
                  value={userData.cellphone || ''}
                  className='bg-transparent focus:outline-none focus:ring-0 pointer-events-none'
                  endContent={
                    <button
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className='pointer-events-auto'
                    >
                      <UpdateFieldModal
                        onUpdate={getUserData}
                        updateType='cellphone'
                        currentValue={userData.cellphone || ''}
                        label={t('Profile.labels.edit-cellphone')}
                        placeholder={t('Profile.place-holders.edit-cellphone')}
                      />
                    </button>
                  }
                />
              </div>
              <ReservationsModal />
            </section>
            <section className='w-full h-2/4 flex flex-col md:flex-row md:justify-around items-center md:items-start'>
              <div className='flex'>
                <Button className='md:w-48 md:mr-12 bg-buttonPrimary' onPress={() => setPasswordModal(true)}>
                  {t('Profile.change_password')}
                </Button>
              </div>
              <div className='w-full flex md:flex-row flex-row-reverse justify-around items-center'>
                <Button className='md:w-48 my-6 md:my-0 bg-[#F68989]'>{t('Profile.log_out')}</Button>
                <Button className='md:w-48 border border-[#FF3030] bg-transparent-'>{t('Profile.delete_account')}</Button>
              </div>
            </section>
          </>
        )}
        {passwordModal && (
          <ChangePasswordModal
            passwordModal={passwordModal}
            setPasswordModal={setPasswordModal}
            onUpdate={getUserData}
          />
        )}
      </div>
    </main>
  )
}

export default Profile