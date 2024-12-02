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
  Input,
  Image
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { userUpdate } from '../../../services/users/PUT/user-update.put.service'
import { IUserUpdateData } from '../../../services/users/models/update-user-data.interface'
import { IUpdateFieldModalProps } from '../models/update-modal-props.interface'
import editIcon from '../../../assets/SVG/edit-icon.svg'

const UpdateFieldModal: React.FC<IUpdateFieldModalProps> = ({
  onUpdate,
  updateType,
  currentValue,
  label,
  placeholder
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserUpdateData>({
    mode: 'onChange',
    reValidateMode: 'onChange'
  })
  const { validateEmail } = useFormValidations()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { t } = useTranslation()

  const validateEmailCombined = (value: string | undefined): string | true => {
    if (!value) {
      return 'Profile.validations.field-require'
    }
    const atValidation = validateEmail.hasAt(value)
    if (atValidation !== true) {
      return atValidation
    }
    const pointValidation = validateEmail.hasPoint(value)
    if (pointValidation !== true) {
      return pointValidation
    }
    return true
  }

  const onSubmit: SubmitHandler<IUserUpdateData> = async data => {
    const response = await userUpdate({ [updateType]: data[updateType] })
    if (response) {
      await onUpdate()
    }
  }

  return (
    <>
      <Button
        data-hover='false'
        disableAnimation
        className='flex max-w-12 justify-end p-0 min-w-0'
        type='button'
        variant='light'
        onPress={onOpen}
      >
        <Image src={editIcon} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>{t(label)}</ModalHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalBody>
                  <Input
                    {...register(updateType, {
                      required: t('Profile.validations.field-require'),
                      validate: value => {
                        if (updateType === 'email') {
                          return validateEmailCombined(value)
                        } else if (updateType === 'name' || updateType === 'lastName') {
                          return (
                            (value &&
                              value.length >= 2 &&
                              value.length <= 50 &&
                              /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) ||
                            t('Profile.validations.name-and-lastname')
                          )
                        } else if (updateType === 'cellphone') {
                          return (value && /^[0-9]{10,15}$/.test(value)) || t('Profile.validations.cellphone')
                        }
                        return true
                      }
                    })}
                    defaultValue={currentValue}
                    type='text'
                    disableAnimation
                    placeholder={placeholder}
                    name={updateType}
                    className='p-2'
                  />
                  {errors[updateType] && <TextError error={errors[updateType]?.message || ''} />}
                </ModalBody>
                <ModalFooter>
                  <Button type='button' color='danger' variant='light' onPress={onClose}>
                    {t('Close')}
                  </Button>
                  <Button type='submit' onPress={onClose}>
                    {t('Confirm')}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateFieldModal
