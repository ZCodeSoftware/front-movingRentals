import React, { useEffect, useState } from 'react'
import { Input, Button } from '@nextui-org/react'
import { IModelForm } from './models/model-form.interface'
import { postModel } from '../../../../../services/vehicle_model/POST/vehicle_model.post.service'

const CreateModel: React.FC = () => {
  const [model, setmodel] = useState<IModelForm>({
    name: ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)

  const validateForm = () => {
    const requiredFields = ['name']
    const hasRequiredFields = requiredFields.every(field => !!model[field as keyof IModelForm])

    return hasRequiredFields
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [model])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setmodel(prevModel => ({
      ...prevModel,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await postModel(model)
    setmodel({
      name: ''
    })
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Modelo</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Nombre'
          name='name'
          value={model.name}
          onChange={handleChange}
          required
          fullWidth
          variant='bordered'
        />
        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Modelo
        </Button>
      </form>
    </div>
  )
}

export default CreateModel
