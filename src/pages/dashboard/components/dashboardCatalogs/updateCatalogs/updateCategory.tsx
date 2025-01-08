import React, { useEffect, useState } from 'react'
import { Input, Button, Textarea, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary'
import UploadImage from '../../uploadImage/UploadImage'
import uploadImageConstants from '../../uploadImage/constants/uploadImageConstants'
import { ICategoryForm } from '../createCatalogs/models/category-form.interface'
import { IUpdateCategory } from './models/update-category-props.interface'
import { putCategory } from '../../../../../services/categories/PUT/category.put.service'

const UpdateCategory: React.FC<IUpdateCategory> = ({
  openUpdateModal,
  setOpenUpdateModal,
  categoryData,
  categoryId,
  onUpdate
}) => {
  const [category, setCategory] = useState<ICategoryForm>({
    name: categoryData?.name || '',
    image: categoryData?.image || '',
    disclaimerEn: categoryData?.disclaimerEn || '',
    disclaimerEs: categoryData?.disclaimerEs || ''
  })
  const [imageFiles, setImageFiles] = useState<Blob[]>([])
  const [submitDisable, setSubmitDisable] = useState(true)

  const validateForm = () => {
    const requiredFields = ['name']
    const hasRequiredFields = requiredFields.every(field => !!category[field as keyof ICategoryForm])
    return hasRequiredFields
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [category, imageFiles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCategory(prevCategory => ({
      ...prevCategory,
      [name]: name === 'price' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await uploadToCloudinary(imageFiles, uploadImageConstants.CATEGORIES, category)
    const validImages = uploadedImages.filter(url => url !== null) as string[]
    const categoryData = {
      ...category,
      images: validImages.length > 0 ? validImages[0] : category.image
    }
    await putCategory(categoryId, categoryData)
    onUpdate()
    setOpenUpdateModal(false)
    setCategory({
      name: categoryData?.name || '',
      image: categoryData?.image || '',
      disclaimerEn: categoryData?.disclaimerEn || '',
      disclaimerEs: categoryData?.disclaimerEs || ''
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
          <h2 className='text-2xl font-bold text-center mb-4'>Modificar categoría</h2>
        </ModalHeader>
        <ModalBody>
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
            <div className='flex space-x-2 border p-2'>
              <img src={category.image} alt={'preview'} className='w-16 h-16 object-cover rounded' />
            </div>
            <UploadImage setUrl={setImageFiles} form={category} imageFiles={imageFiles} isMultiple={false} />
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

export default UpdateCategory
