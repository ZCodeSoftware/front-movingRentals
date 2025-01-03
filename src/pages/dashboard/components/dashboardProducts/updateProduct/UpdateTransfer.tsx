import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { ITransferForm } from '../createProduct/models/transfer-form.interface'
import { IUpdateTransfer } from './models/update-transfer-props.interface'
import { putTransfer } from '../../../../../services/transfers/PUT/transfers.put.service'

const UpdateTransfer: React.FC<IUpdateTransfer> = ({
  openUpdateModal,
  setOpenUpdateModal,
  transferData,
  transferId,
  onUpdate
}) => {
  const [transfer, setTransfer] = useState<ITransferForm>({
    name: transferData?.name || '',
    description: transferData?.description || '',
    capacity: transferData?.capacity || 0,
    estimatedDuration: transferData?.estimatedDuration || '',
    price: transferData?.price || 0,
    category: transferData?.category._id || ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)

  const validateForm = () => {
    const requiredFields = ['name', 'estimatedDuration', 'capacity']
    const hasRequiredFields = requiredFields.every(field => !!transfer[field as keyof ITransferForm])
    const hasPrices = transfer.price > 0

    return hasRequiredFields && hasPrices
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [transfer])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTransfer(prevTransfer => ({
      ...prevTransfer,
      [name]: name === 'price' || name === 'capacity' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await putTransfer(transferId, transfer)
    onUpdate()
    setOpenUpdateModal(false)
    setTransfer({
      name: transferData?.name || '',
      description: transferData?.description || '',
      capacity: transferData?.capacity || 0,
      estimatedDuration: transferData?.estimatedDuration || '',
      price: transferData?.price || 0,
      category: transferData?.category._id || ''
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
          <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Vehiculo</h2>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Nombre'
              name='name'
              value={transfer.name}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />
            <Textarea
              label='Descripción'
              name='description'
              value={transfer.description}
              onChange={handleChange}
              fullWidth
              variant='bordered'
            />
            <Input
              label='Precio'
              name='price'
              type='number'
              value={transfer.price.toString()}
              onChange={handleChange}
              fullWidth
              required
              variant='bordered'
            />
            <div className='flex flex-row space-x-4'>
              <Input
                label='Duración estimada'
                value={transfer.estimatedDuration}
                name='estimatedDuration'
                onChange={handleChange}
                fullWidth
                required
                variant='bordered'
              />
              <Input
                label='Capacidad'
                type='number'
                name='capacity'
                value={transfer.capacity.toString()}
                onChange={handleChange}
                fullWidth
                required
                variant='bordered'
              />
            </div>
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

export default UpdateTransfer

