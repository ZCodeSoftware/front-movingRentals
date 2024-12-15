import { Input, Modal, ModalBody, ModalContent, ModalHeader, Button } from '@nextui-org/react'
import { useState } from 'react'
import { IOwnerForm } from '../models/owner-form.interface'
import { postOwner } from '../../../../../../services/owners/POST/vehicle-owners.post.service'

const CreateOwnerModal = ({ setOwnerModal, ownerModal }: any) => {
  const [owner, setOwner] = useState<IOwnerForm>({
    name: '',
    commissionPercentage: 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOwner(prevOwner => ({
      ...prevOwner,
      [name]: name === 'commissionPercentage' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await postOwner(owner)
    setOwner({
      name: '',
      commissionPercentage: 0
    })
    setOwnerModal(false)
  }

  return (
    <Modal
      isOpen={ownerModal}
      onClose={() => setOwnerModal(false)}
      placement='top-center'
      className='md:w-2/4 h-auto absolute z-50'
    >
      <ModalContent>
        <>
          <ModalHeader className='flex flex-col gap-1'>Crear Nuevo Dueño</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                autoFocus
                label='Nombre'
                name='name'
                variant='bordered'
                value={owner.name}
                onChange={handleChange}
              />
              <Input
                label='Porcentage de comisión'
                name='commissionPercentage'
                variant='bordered'
                onChange={handleChange}
              />
              <div className='flex justify-around p-4'>
                <Button color='danger' variant='flat' type='button' onPress={() => setOwnerModal(false)}>
                  Cancelar
                </Button>
                <Button color='primary' type='submit'>
                  Guardar
                </Button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  )
}

export default CreateOwnerModal
