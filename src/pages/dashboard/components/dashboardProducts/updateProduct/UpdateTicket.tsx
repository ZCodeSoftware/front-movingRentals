import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { IUpdateTicket } from './models/update-ticket-props.interface'
import { ITicketForm } from '../createProduct/models/ticket-form.interface'
import { putTicket } from '../../../../../services/products/tickets/PUT/ticket.put.service'

const UpdateTicket: React.FC<IUpdateTicket> = ({
  openUpdateModal,
  setOpenUpdateModal,
  ticketData,
  ticketId,
  onUpdate
}) => {
  const [ticket, setTicket] = useState<ITicketForm>({
    name: ticketData?.name || '',
    description: ticketData?.description || '',
    location: ticketData?.location || '',
    movingPrice: ticketData?.movingPrice || 0,
    cenotePrice: ticketData?.cenotePrice || 0,
    totalPrice: ticketData?.totalPrice || 0,
    category: ticketData?.category._id || ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)
  const numberFields = ['movingPrice', 'totalPrice', 'cenotePrice']

  const validateForm = () => {
    const requiredFields = ['name', 'movingPrice', 'cenotePrice', 'totalPrice', 'location']
    const hasRequiredFields = requiredFields.every(field => !!ticket[field as keyof ITicketForm])
    const hasPrices = ticket.totalPrice > 0 && ticket.movingPrice > 0 && ticket.cenotePrice > 0

    return hasRequiredFields && hasPrices
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [ticket])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTicket(prevTicket => ({
      ...prevTicket,
      [name]: numberFields.includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await putTicket(ticketId, ticket)
    onUpdate()
    setOpenUpdateModal(false)
    setTicket({
      name: ticketData?.name || '',
      description: ticketData?.description || '',
      location: ticketData?.location || '',
      movingPrice: ticketData?.movingPrice || 0,
      cenotePrice: ticketData?.cenotePrice || 0,
      totalPrice: ticketData?.totalPrice || 0,
      category: ticketData?.category._id || ''
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
          <h2 className='text-2xl font-bold text-center mb-4'>Modificar ticket</h2>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Input
              label='Nombre'
              name='name'
              value={ticket.name}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />
            <Textarea
              label='Descripción'
              name='description'
              value={ticket.description}
              onChange={handleChange}
              fullWidth
              variant='bordered'
            />
            <Input
              label='Locación'
              name='location'
              value={ticket.location}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />
            <div className='flex flex-row space-x-4'>
              <Input
                label='Moving price'
                value={ticket.movingPrice.toString()}
                type='number'
                name='movingPrice'
                onChange={handleChange}
                fullWidth
                required
                variant='bordered'
              />
              <Input
                label='Cenote price'
                type='number'
                name='cenotePrice'
                value={ticket.cenotePrice.toString()}
                onChange={handleChange}
                fullWidth
                required
                variant='bordered'
              />
              <Input
                label='Precio total'
                name='totalPrice'
                type='number'
                value={ticket.totalPrice.toString()}
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

export default UpdateTicket
