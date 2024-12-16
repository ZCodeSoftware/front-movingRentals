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
        <Input label='Nombre' name='name' value={transfer.name} onChange={handleChange} fullWidth variant='bordered' />
        <Textarea
          label='Descripción'
          name='description'
          value={transfer.description}
          onChange={handleChange}
          fullWidth
          variant='bordered'
        />
        <Input label='Precio' name='price' type='number' onChange={handleChange} fullWidth variant='bordered' />
        <div className='flex flex-row space-x-4'>
          <Input
            label='Duración estimada'
            name='estimatedDuration'
            onChange={handleChange}
            fullWidth
            variant='bordered'
          />
          <Input label='Capacidad' type='number' name='capacity' onChange={handleChange} fullWidth variant='bordered' />
        </div>

        <Button type='submit' color='primary' fullWidth className='mt-4'>
          Crear Transfer
        </Button>
      </form>
    </div>
  )
}

export default CreateTransfer
