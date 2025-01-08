import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea } from '@nextui-org/react'
import { ICategoryForm } from './models/category-form.interface'
import UploadImage from '../../uploadImage/UploadImage'
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary'
import uploadImageConstants from '../../uploadImage/constants/uploadImageConstants'
import { postCategory } from '../../../../../services/categories/POST/category.post.service'

const CreateCategory: React.FC = () => {
  const [category, setCategory] = useState<ICategoryForm>({
    name: '',
    image: '',
    disclaimerEn: '',
    disclaimerEs: ''
  })
  const [submitDisable, setSubmitDisable] = useState(true)
  const [imageFiles, setImageFiles] = useState<Blob[]>([])

  const validateForm = () => {
    const requiredFields = ['name']
    const hasRequiredFields = requiredFields.every(field => !!category[field as keyof ICategoryForm])

    return hasRequiredFields
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCategory(prevCategory => ({
      ...prevCategory,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await uploadToCloudinary(imageFiles, uploadImageConstants.CATEGORIES, category)
    const validImages = uploadedImages.filter(url => url !== null) as string[]
    const categoryData = {
      ...category,
      image: validImages[0]
    }
    await postCategory(categoryData)
    setCategory({
      name: '',
      image: '',
      disclaimerEn: '',
      disclaimerEs: ''
    })
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nueva categoría</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Nombre'
          name='name'
          value={category.name}
          onChange={handleChange}
          required
          fullWidth
          variant='bordered'
        />
        <Textarea
          label='Aviso en Español'
          name='disclaimerEs'
          value={category.disclaimerEs}
          onChange={handleChange}
          fullWidth
          variant='bordered'
        />
        <Textarea
          label='Aviso en Ingles'
          name='disclaimerEn'
          value={category.disclaimerEn}
          onChange={handleChange}
          fullWidth
          variant='bordered'
        />
        <UploadImage setUrl={setImageFiles} form={category} imageFiles={imageFiles} isMultiple={false} />

        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Categoría
        </Button>
      </form>
    </div>
  )
}

export default CreateCategory
