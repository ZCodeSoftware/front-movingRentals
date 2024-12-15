import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea } from '@nextui-org/react'
import { ITourForm } from './models/tour-form.interface'
import uploadToCloudinary from '../../tempUploadImage/uploadImage'
import { postTour } from '../../../../../services/products/tours/GET/POST/tours.post.service'
import { fetchCategories } from '../../../../../services/categories/categoriesService'

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
  const [imageFiles, setImageFiles] = useState<File[]>([])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTour(prevVehicle => ({
      ...prevVehicle,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles([...e.target.files])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)))
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

  console.log(tour)

  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Tour</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input label='Nombre' name='name' value={tour.name} onChange={handleChange} fullWidth variant='bordered' />
        <Textarea
          label='Descripción'
          name='description'
          value={tour.description}
          onChange={handleChange}
          fullWidth
          variant='bordered'
        />
        <Textarea label='Itinerario' name='itinerary' onChange={handleChange} fullWidth variant='bordered' />
        <Input label='Precio' name='price' type='number' onChange={handleChange} fullWidth variant='bordered' />
        <div className='flex flex-row space-x-4'>
          <Input
            label='Duración estimada'
            name='estimatedDuration'
            onChange={handleChange}
            fullWidth
            variant='bordered'
          />
          <Input label='Horas de inicio' name='startDates' onChange={handleChange} fullWidth variant='bordered' />
          <Input label='Capacidad' name='capacity' onChange={handleChange} fullWidth variant='bordered' />
        </div>

        <Input
          label='Subir Imágenes'
          className='p-6'
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          fullWidth
          variant='bordered'
        />

        <Button type='submit' color='primary' fullWidth className='mt-4'>
          Crear Tour
        </Button>
      </form>
    </div>
  )
}

export default CreateTour
