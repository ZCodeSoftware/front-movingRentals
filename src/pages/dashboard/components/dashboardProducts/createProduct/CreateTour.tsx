import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea } from '@nextui-org/react'
import { ITourForm } from './models/tour-form.interface'
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary'
import { postTour } from '../../../../../services/products/tours/POST/tours.post.service'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import UploadImage from '../../uploadImage/UploadImage'
import uploadImageConstants from '../../uploadImage/constants/uploadImageConstants'

const CreateTour: React.FC = () => {
  const [tour, setTour] = useState<ITourForm>({
    name: '',
    price: 0,
    itinerary: '',
    capacity: '',
    estimatedDuration: '',
    startDates: '',
    description: '',
    images: [],
    category: ''
  })
  const [imageFiles, setImageFiles] = useState<Blob[]>([])
  const [submitDisable, setSubmitDisable] = useState(true)

  useEffect(() => {
    const getCategories = async () => {
      const response = await fetchCategories()
      if (response) {
        const filterTour = response.find(c => c.name === 'Tours')
        setTour(prev => ({
          ...prev,
          category: filterTour?._id || ''
        }))
      }
    }
    getCategories()
  }, [])

  const validateForm = () => {
    const requiredFields = ['name', 'description', 'itinerary', 'estimatedDuration', 'startDates', 'capacity']
    const hasRequiredFields = requiredFields.every(field => !!tour[field as keyof ITourForm])
    const hasImages = imageFiles.length > 0
    const hasPrices = tour.price > 0

    return hasRequiredFields && hasImages && hasPrices
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [tour, imageFiles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTour(prevTour => ({
      ...prevTour,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await uploadToCloudinary(imageFiles, uploadImageConstants.TOURS, tour)
    const validImages = uploadedImages.filter(url => url !== null) as string[]
    const toursData = {
      ...tour,
      images: validImages,
      description: JSON.stringify(tour.description),
      itinerary: JSON.stringify(tour.itinerary)
    }
    await postTour(toursData)
    setTour({
      name: '',
      price: 0,
      itinerary: '',
      capacity: '',
      estimatedDuration: '',
      startDates: '',
      description: '',
      images: [],
      category: ''
    })
  }

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Tour</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Nombre'
          name='name'
          value={tour.name}
          onChange={handleChange}
          required
          fullWidth
          variant='bordered'
        />
        <Textarea
          label='Descripción'
          name='description'
          value={tour.description}
          onChange={handleChange}
          fullWidth
          required
          variant='bordered'
        />
        <Textarea
          label='Itinerario'
          name='itinerary'
          value={tour.itinerary}
          onChange={handleChange}
          fullWidth
          required
          variant='bordered'
        />
        <Input
          label='Precio'
          name='price'
          type='number'
          value={tour.price.toString()}
          onChange={handleChange}
          fullWidth
          required
          variant='bordered'
        />
        <div className='flex flex-row space-x-4'>
          <Input
            label='Duración estimada'
            name='estimatedDuration'
            value={tour.estimatedDuration}
            onChange={handleChange}
            fullWidth
            required
            variant='bordered'
          />
          <Input
            label='Horas de inicio'
            name='startDates'
            value={tour.startDates}
            onChange={handleChange}
            fullWidth
            required
            variant='bordered'
          />
          <Input
            label='Capacidad'
            name='capacity'
            value={tour.capacity}
            onChange={handleChange}
            fullWidth
            required
            variant='bordered'
          />
        </div>

        <UploadImage setUrl={setImageFiles} form={tour} imageFiles={imageFiles} />

        <Button type='submit' color='primary' fullWidth className='mt-4' isDisabled={submitDisable}>
          Crear Tour
        </Button>
      </form>
    </div>
  )
}

export default CreateTour
