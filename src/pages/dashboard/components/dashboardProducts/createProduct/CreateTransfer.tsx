import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea } from '@nextui-org/react'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import { ITransferForm } from './models/transfer-form.interface'
import { postTransfer } from '../../../../../services/transfers/POST/transfers.post.service'

const CreateTransfer: React.FC = () => {
  const [transfer, setTransfer] = useState<ITransferForm>({
    name: '',
    description: '',
    capacity: 0,
    estimatedDuration: '',
    price: 0,
    category: ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories()
      if (response) {
        const filterTransfer = response.find(c => c.name === 'Transfer')
        setTransfer(prev => ({
          ...prev,
          category: filterTransfer?._id || ''
        }))
      }
    }
    getCategories()
  }, [])

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
    await postTransfer(transfer)
    setTransfer({
      name: '',
      description: '',
      capacity: 0,
      estimatedDuration: '',
      price: 0,
      category: ''
    })
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Traslado</h2>
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

        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Translado
        </Button>
      </form>
    </div>
  )
}

export default CreateTransfer
