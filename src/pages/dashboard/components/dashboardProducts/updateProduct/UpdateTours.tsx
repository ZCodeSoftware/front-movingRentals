import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { ITourForm } from '../createProduct/models/tour-form.interface'
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary'
import UploadImage from '../../uploadImage/UploadImage'
import uploadImageConstants from '../../uploadImage/constants/uploadImageConstants'
import { IUpdateTour } from './models/update-tour-props.interface'
import { putTour } from '../../../../../services/products/tours/PUT/tours.put.service'

const UpdateTour: React.FC<IUpdateTour> = ({ openUpdateModal, setOpenUpdateModal, tourData, tourId, onUpdate }) => {
  const [tour, setTour] = useState<ITourForm>({
    name: tourData?.name || '',
    price: tourData?.price || 0,
    itinerary: tourData?.itinerary ? JSON.parse(tourData.itinerary) : '',
    capacity: tourData?.capacity || '',
    estimatedDuration: tourData?.estimatedDuration || '',
    startDates: tourData?.startDates || '',
    description: tourData?.description ? JSON.parse(tourData.description) : '',
    images: tourData?.images || [],
    category: tourData?.category._id || ''
  })
  const [imageFiles, setImageFiles] = useState<Blob[]>([])
  const [submitDisable, setSubmitDisable] = useState(true)

  const validateForm = () => {
    const requiredFields = ['name', 'description', 'itinerary', 'estimatedDuration', 'startDates', 'capacity']
    const hasRequiredFields = requiredFields.every(field => !!tour[field as keyof ITourForm])
    const hasPrices = tour.price > 0

    return hasRequiredFields && hasPrices
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
      images: validImages.length > 0 ? validImages : tour.images,
      description: JSON.stringify(tour.description),
      itinerary: JSON.stringify(tour.itinerary)
    }
    await putTour(tourId, toursData)
    onUpdate()
    setOpenUpdateModal(false)
    setTour({
      name: tourData?.name || '',
      price: tourData?.price || 0,
      itinerary: tourData?.itinerary || '',
      capacity: tourData?.capacity || '',
      estimatedDuration: tourData?.estimatedDuration || '',
      startDates: tourData?.startDates || '',
      description: tourData?.description || '',
      images: tourData?.images || [],
      category: tourData?.category._id || ''
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
            <div className='flex space-x-2 border p-2'>
              {tour.images.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} className='w-16 h-16 object-cover rounded' />
              ))}
            </div>
            <UploadImage setUrl={setImageFiles} form={tour} imageFiles={imageFiles} />
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

export default UpdateTour
