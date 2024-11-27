import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import useFormValidations from '../../../hooks/useFormValidation'
import TextError from '../../../components/textError/TextError'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { userUpdate } from '../../../services/users/PUT/user-update.put.service'
import { IUserUpdateData } from '../../../services/users/models/update-user-data.interface'
import { IUpdateEmailModalProps } from '../models/update-email-modal-props.interface'

const UpdateEmailModal: React.FC<IUpdateEmailModalProps> = ({ onUpdate }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserUpdateData>({ mode: 'onChange', reValidateMode: 'onChange' })
  const { validateEmail } = useFormValidations()
  const [isFocused, setIsFocused] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { t } = useTranslation()

  const onSubmit: SubmitHandler<IUserUpdateData> = async data => {
    const response = await userUpdate(data)
    if (response) {
      await onUpdate()
    }
  }

  return (
    <>
      <Button type='button' onPress={onOpen}>
        {t('Edit')}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'> {t('Email edit')}</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <Input
                    {...register('email', {
                      required: t('SignIn.formValidations.requires.email_require'),
                      validate: validateEmail
                    })}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    type='email'
                    placeholder='Enter your new email'
                    name='email'
                    className='p-2'
                  />
                  {isFocused && errors.email && errors.email.message && <TextError error={errors.email.message} />}
                </ModalBody>
                <ModalFooter>
                  <Button type='button' color='danger' variant='light' onPress={onClose}>
                    {t('Profile.reservations.close_button')}
                  </Button>
                  <Button type='submit'>Confirm</Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateEmailModal
