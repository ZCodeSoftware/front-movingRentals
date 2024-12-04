import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const ReservationsModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { t } = useTranslation()

  return (
    <>
      <Button onPress={onOpen} className='w-64 bg-buttonPrimary'>
        {t('Profile.reservations.title')}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'> {t('Profile.reservations.title')}</ModalHeader>
              <ModalBody>
                <p>Reservations</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  {t('Profile.reservations.close_button')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReservationsModal
