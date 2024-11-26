import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react'

const ReservationsModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen} className='w-64'>
        My reservations
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>My reservations</ModalHeader>
              <ModalBody>
                <p>Reservations</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
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
