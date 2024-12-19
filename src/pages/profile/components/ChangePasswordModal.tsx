import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import useFormValidations from '../../../hooks/useFormValidation'
import TextError from '../../../components/textError/TextError'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { userUpdate } from '../../../services/users/PUT/user-update.put.service'
import { IUserUpdateData } from '../../../services/users/models/update-user-data.interface'
import { IChangePasswordProps } from '../models/change-password-props.interface'

const ChangePasswordModal: React.FC<IChangePasswordProps> = ({ onUpdate, passwordModal, setPasswordModal }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IUserUpdateData>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
  const { validatePassword } = useFormValidations()
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false })
  const passwordConfirm = watch('password')
  const togglePasswordVisibility = () => setIsVisible({ ...isVisible, password: !isVisible.password })
  const toggleConfirmPasswordVisibility = () =>
    setIsVisible({ ...isVisible, confirmPassword: !isVisible.confirmPassword })

  const onSubmit: SubmitHandler<IUserUpdateData> = async data => {
    const response = await userUpdate({ password: data.password })
    if (response) {
      await onUpdate()
      setPasswordModal(false)
    }
  }

  return (
    <>
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Cambiar contraseña</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <Input
                    label='Contraseña'
                    {...register('password', {
                      required: t('SignIn.formValidations.requires.password_require'),
                      validate: validatePassword
                    })}
                    type={isVisible.password ? 'text' : 'password'}
                    className='p-2 my-2'
                    endContent={
                      <button
                        className='focus:outline-none'
                        type='button'
                        onClick={togglePasswordVisibility}
                        aria-label='toggle password visibility'
                      >
                        {isVisible.password ? (
                          <h1 className='text-2xl text-default-400 pointer-events-none'>OO</h1>
                        ) : (
                          <h1 className='text-2xl text-default-400 pointer-events-none'>O</h1>
                        )}
                      </button>
                    }
                  />
                  <Input
                    label='Confirmar contraseña'
                    {...register('changePassword', {
                      required: t('Profile.validations.field-require'),
                      validate: value =>
                        value === passwordConfirm || t('SignIn.formValidations.requires.confirm_password_match')
                    })}
                    type={isVisible.confirmPassword ? 'text' : 'password'}
                    className='p-2'
                    endContent={
                      <button
                        className='focus:outline-none'
                        type='button'
                        onClick={toggleConfirmPasswordVisibility}
                        aria-label='toggle password visibility'
                      >
                        {isVisible.confirmPassword ? (
                          <h1 className='text-2xl text-default-400 pointer-events-none'>OO</h1>
                        ) : (
                          <h1 className='text-2xl text-default-400 pointer-events-none'>O</h1>
                        )}
                      </button>
                    }
                  />
                  {errors.password && <TextError error={errors.password?.message || ''} />}
                </ModalBody>
                <ModalFooter>
                  <Button type='button' color='danger' variant='light' onPress={onClose}>
                    {t('Close')}
                  </Button>
                  <Button type='submit'>{t('Confirm')}</Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ChangePasswordModal
