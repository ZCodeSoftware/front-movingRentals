import React, { useEffect, useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { IOwnerForm } from './models/owner-form.interface'
import { postOwner } from '../../../../../services/owners/POST/vehicle-owners.post.service'

const CreateOwner: React.FC = () => {
  const [owner, setOwner] = useState<IOwnerForm>({
    name: '',
    commissionPercentage: 0
  })
  const [submitDisable, setSubmitDisable] = useState(true)
  const [displayValue, setDisplayValue] = useState(owner.commissionPercentage?.toString().replace('.', ',') || '')

  const validateForm = () => {
    const requiredFields = ['name', 'commissionPercentage']
    const hasRequiredFields = requiredFields.every(field => !!owner[field as keyof IOwnerForm])

    return hasRequiredFields
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [owner])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setOwner(prevModel => ({
      ...prevModel,
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
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Dueño</h2>
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
          value={displayValue}
          onChange={e => {
            const value = e.target.value
            const regex = /^$|^[0-9]*(,[0-9]*)?$/

            if (regex.test(value)) {
              setDisplayValue(value)
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
        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Dueño
        </Button>
      </form>
    </div>
  )
}

export default CreateOwner
