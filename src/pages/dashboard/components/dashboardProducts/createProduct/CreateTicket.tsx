import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea } from '@nextui-org/react'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import { ITicketForm } from './models/ticket-form.interface'
import { postTicket } from '../../../../../services/products/tickets/POST/ticket.post.service'

const CreateTicket: React.FC = () => {
  const [ticket, setTicket] = useState<ITicketForm>({
    name: '',
    description: '',
    location: '',
    movingPrice: 0,
    cenotePrice: 0,
    totalPrice: 0,
    category: ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)
  const numberFields = ['movingPrice', 'totalPrice', 'cenotePrice']

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories()
      if (response) {
        const filterTicket = response.find(c => c.name === 'Ticket')
        setTicket(prev => ({
          ...prev,
          category: filterTicket?._id || ''
        }))
      }
    }
    getCategories()
  }, [])

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
    await postTicket(ticket)
    setTicket({
      name: '',
      description: '',
      location: '',
      movingPrice: 0,
      cenotePrice: 0,
      totalPrice: 0,
      category: ''
    })
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Ticket</h2>
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
        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Ticket
        </Button>
      </form>
    </div>
  )
}

export default CreateTicket
