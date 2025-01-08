import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { IOwnerForm } from '../createCatalogs/models/owner-form.interface'
import { IUpdateOwner } from './models/update-owner-props.interface'
import { putOwner } from '../../../../../services/owners/PUT/owner.put.service'

const UpdateOwner: React.FC<IUpdateOwner> = ({ openUpdateModal, setOpenUpdateModal, ownerData, ownerId, onUpdate }) => {
  const [owner, setOwner] = useState<IOwnerForm>({
    name: ownerData?.name || '',
    commissionPercentage: ownerData?.commissionPercentage || 0
  })
  const [submitDisable, setSubmitDisable] = useState(true)

  const validateForm = () => {
    const requiredFields = ['name']
    const hasRequiredFields = requiredFields.every(field => !!owner[field as keyof IOwnerForm])
    return hasRequiredFields
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [owner])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOwner(prevOwner => ({
      ...prevOwner,
      [name]: name === 'commissionPercentage' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await putOwner(ownerId, owner)
    onUpdate()
    setOpenUpdateModal(false)
    setOwner({
      name: ownerData?.name || '',
      commissionPercentage: ownerData?.commissionPercentage || 0
    })
  }

  return (
    <Modal
      isOpen={openUpdateModal}
      onClose={() => setOpenUpdateModal(false)}
      placement='top-center'
      className='h-auto max-h-screen absolute z-50 md:w-2/4 max-w-full overflow-y-auto'
    >
      <ModalContent>
        <ModalHeader>
          <h2 className='text-2xl font-bold text-center mb-4'>Modificar modelo</h2>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Nombre'
              name='name'
              value={owner.name}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />
            <Input
              label='Porcentaje de comisión'
              name='commissionPercentage'
              type='text'
              value={owner.commissionPercentage.toString()}
              onChange={e => {
                const value = e.target.value
                const regex = /^[0-9]*[.,]?[0-9]*$/
                if (regex.test(value)) {
                  handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: e.target.name,
                      value: value.replace(',', '.')
                    }
                  })
                }
              }}
              min={0}
              required
              fullWidth
              variant='bordered'
            />
            <ModalFooter>
              <Button color='danger' variant='flat' type='button' onPress={() => setOpenUpdateModal(false)}>
                Cancelar
              </Button>
              <Button color='primary' type='submit' isDisabled={submitDisable}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateOwner
