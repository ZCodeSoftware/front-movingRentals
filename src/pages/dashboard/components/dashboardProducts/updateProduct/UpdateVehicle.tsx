import React, { useState, useEffect } from 'react'
import {
  Input,
  Button,
  Select,
  SelectItem,
  SelectSection,
  Skeleton,
  Textarea,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent
} from '@nextui-org/react'
import { IVehicleForm } from '../createProduct/models/vehicles-form.interface'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import { ICategories } from '../../../../../services/categories/models/categories.interface'
import { useTranslation } from 'react-i18next'
import uploadToCloudinary from '../../uploadImage/uploadImageToCloudinary'
import { IVehicleOwners } from '../../../../../services/owners/models/vehicle-owners.interface'
import { fetchAllVehicleOwners } from '../../../../../services/owners/GET/vehicle-owners.get.service'
import CreateOwnerModal from '../createProduct/components/CreateOwnerModal'
import { IUpdateVehicleProps } from './models/update-vehicle-props.interface'
import { putVehicle } from '../../../../../services/products/vehicles/PUT/vehicles.put.service'
import UploadImage from '../../uploadImage/UploadImage'
import uploadImageConstants from '../../uploadImage/constants/uploadImageConstants'
import { fetchAllModels } from '../../../../../services/vehicle_model/GET/vehicle_model.get.service'
import { IVehicle_model } from '../../../../../services/vehicle_model/models/vehicle_model.interface'
import CreateModelModal from '../createProduct/components/CreateModelModal'

const UpdateVehicle: React.FC<IUpdateVehicleProps> = ({
  openUpdateModal,
  setOpenUpdateModal,
  vehicleData,
  vehicleId,
  onUpdate
}) => {
  const [vehicle, setVehicle] = useState<IVehicleForm>({
    name: vehicleData?.name || '',
    description: vehicleData?.description || '',
    category: vehicleData?.category._id || '',
    images: vehicleData?.images || [],
    owner: vehicleData?.owner._id || '',
    price: vehicleData?.price || 0,
    pricePer4: vehicleData?.pricePer4 || 0,
    pricePer8: vehicleData?.pricePer8 || 0,
    pricePer24: vehicleData?.pricePer24 || 0,
    capacity: vehicleData?.capacity || 0,
    minRentalHours: vehicleData?.minRentalHours || 0,
    tag: vehicleData?.tag || '',
    model: ''
  })
  const [categoriesData, setCategoriesData] = useState<ICategories[]>([])
  const [vehicleOwnersData, setVehicleOwnersData] = useState<IVehicleOwners[]>([])
  const [vehicleModelData, setVehicleModelData] = useState<IVehicle_model[]>([])
  const [imageFiles, setImageFiles] = useState<Blob[]>([])
  const [submitDisable, setSubmitDisable] = useState(true)
  const [loading, setLoading] = useState(true)
  const [openOwnerModal, setOpenOwnerModal] = useState(false)
  const [openModelModal, setOpenModelModal] = useState(false)
  const { t } = useTranslation()

  const filterCategories = categoriesData.filter(p => p.name != 'Tours' && p.name != 'Transfer')

  const numberFields = ['price', 'pricePer4', 'pricePer8', 'pricePer24', 'capacity', 'minRentalHours']

  const getCategories = async () => {
    const result = await fetchCategories()
    if (result) setCategoriesData(result)
    setLoading(false)
  }

  const getVehicleOwners = async () => {
    const result = await fetchAllVehicleOwners()
    if (result) {
      setVehicleOwnersData(result)
      setLoading(false)
    }
  }

  const getVehicleModels = async () => {
    const result = await fetchAllModels()
    if (result) {
      setVehicleModelData(result)
      setLoading(false)
    }
  }

  const validateForm = () => {
    const requiredFields = ['name', 'category', 'owner', 'minRentalHours', 'capacity']
    const hasRequiredFields = requiredFields.every(field => !!vehicle[field as keyof IVehicleForm])
    const hasPrices = vehicle.price > 0

    return hasRequiredFields && hasPrices
  }

  useEffect(() => {
    setSubmitDisable(!validateForm())
  }, [vehicle])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setVehicle(prevVehicle => ({
      ...prevVehicle,
      [name]: numberFields.includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await uploadToCloudinary(imageFiles, uploadImageConstants.VEHICLES, vehicle)
    const validImages = uploadedImages.filter(url => url !== null) as string[]
    const vehiclePost = {
      ...vehicle,
      images: validImages.length > 0 ? validImages : vehicle.images
    }
    await putVehicle(vehicleId, vehiclePost)
    await onUpdate()
    setOpenUpdateModal(false)
    setVehicle({
      name: vehicleData?.name || '',
      description: vehicleData?.description || '',
      category: vehicleData?.category._id || '',
      images: vehicleData?.images || [],
      owner: vehicleData?.owner._id || '',
      price: vehicleData?.price || 0,
      pricePer4: vehicleData?.pricePer4 || 0,
      pricePer8: vehicleData?.pricePer8 || 0,
      pricePer24: vehicleData?.pricePer24 || 0,
      capacity: vehicleData?.capacity || 0,
      minRentalHours: vehicleData?.minRentalHours || 0,
      tag: vehicleData?.tag || '',
      model: vehicleData?.model._id || ''
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
              label='Nombre del Producto'
              name='name'
              value={vehicle.name}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />
            <Input
              label='Tag del Producto'
              name='tag'
              value={vehicle.tag}
              onChange={handleChange}
              required
              fullWidth
              variant='bordered'
            />

            <Textarea
              label='Descripción'
              name='description'
              value={vehicle.description}
              onChange={handleChange}
              fullWidth
              variant='bordered'
            />

            <Select
              label='Categoría'
              placeholder={vehicleData?.category.name}
              value={vehicle.category}
              name='category'
              required
              selectedKeys={[vehicle.category]}
              onChange={handleChange}
              variant='bordered'
              renderValue={() => {
                return vehicleData?.category.name
              }}
              onOpenChange={async isOpen => {
                if (isOpen) {
                  await getCategories()
                }
              }}
            >
              {loading ? (
                <SelectItem key='skeleton-1' isDisabled>
                  <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
                </SelectItem>
              ) : filterCategories.length > 0 ? (
                filterCategories.map(c => (
                  <SelectItem key={c._id} className='text-center'>
                    {c.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key='no-products' className='text-gray-500 text-center'>
                  {t('HomeRental.no_products_available')}
                </SelectItem>
              )}
            </Select>
            <div className='flex flex-row space-x-4'>
              <Input
                label='Precio'
                name='price'
                type='number'
                value={vehicle.price?.toString()}
                onChange={handleChange}
                fullWidth
                required
                min={0}
                variant='bordered'
              />
              <Input
                label='Precio por 4 horas'
                name='pricePer4'
                type='number'
                value={vehicle.pricePer4?.toString()}
                onChange={handleChange}
                fullWidth
                min={0}
                variant='bordered'
              />
              <Input
                label='Precio por 8 horas'
                name='pricePer8'
                type='number'
                value={vehicle.pricePer8?.toString()}
                onChange={handleChange}
                fullWidth
                min={0}
                variant='bordered'
              />
              <Input
                label='Precio por 24 horas'
                name='pricePer24'
                type='number'
                value={vehicle.pricePer24?.toString()}
                onChange={handleChange}
                fullWidth
                min={0}
                variant='bordered'
              />
            </div>
            <div className='flex flex-row space-x-4'>
              <Input
                label='Minimo de tiempo de renta'
                name='minRentalHours'
                type='number'
                value={vehicle.minRentalHours.toString()}
                onChange={handleChange}
                fullWidth
                required
                min={0}
                variant='bordered'
              />
              <Input
                label='Capacidad'
                name='capacity'
                type='number'
                value={vehicle.capacity.toString()}
                onChange={handleChange}
                fullWidth
                required
                min={0}
                variant='bordered'
              />
            </div>

            <Select
              label='Dueño'
              placeholder={vehicleData?.owner.name}
              value={vehicle.owner}
              name='owner'
              selectedKeys={[vehicle.owner]}
              required
              onChange={handleChange}
              variant='bordered'
              onOpenChange={async isOpen => {
                if (isOpen) {
                  await getVehicleOwners()
                }
              }}
              renderValue={() => {
                const renderValue = vehicleOwnersData.find(
                  o => o._id === vehicle.owner && o.name !== 'Crear nuevo dueño'
                )
                return renderValue ? renderValue.name : ''
              }}
            >
              {loading ? (
                <SelectItem key='skeleton-1' isDisabled>
                  <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
                </SelectItem>
              ) : (
                [
                  <SelectSection>
                    <SelectItem
                      unselectable='on'
                      className='text-center h-12'
                      hideSelectedIcon
                      key={1}
                      onPress={() => setOpenOwnerModal(true)}
                    >
                      Crear nuevo dueño
                    </SelectItem>
                  </SelectSection>,
                  <SelectSection key='owners-section' title='Dueños existentes'>
                    {vehicleOwnersData.length > 0 ? (
                      vehicleOwnersData.map(o => (
                        <SelectItem key={o._id} className='text-center'>
                          {o.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key='no-products' className='text-gray-500 text-center'>
                        {t('HomeRental.no_products_available')}
                      </SelectItem>
                    )}
                  </SelectSection>
                ]
              )}
            </Select>
            <Select
              label='Modelo'
              placeholder={vehicleData?.model.name}
              value={vehicle.model}
              name='model'
              selectedKeys={[vehicle.model]}
              onChange={handleChange}
              required
              variant='bordered'
              onOpenChange={async isOpen => {
                if (isOpen) {
                  await getVehicleModels()
                }
              }}
              renderValue={() => {
                const renderValue = vehicleModelData.find(
                  m => m._id === vehicle.model && m.name !== 'Crear nuevo modelo'
                )
                return renderValue ? renderValue.name : ''
              }}
            >
              {loading ? (
                <SelectItem key='skeleton-1' isDisabled>
                  <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
                  <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
                </SelectItem>
              ) : (
                [
                  <SelectSection>
                    <SelectItem
                      unselectable='on'
                      className='text-center h-12'
                      hideSelectedIcon
                      key={1}
                      onPress={() => setOpenModelModal(true)}
                    >
                      Crear nuevo modelo
                    </SelectItem>
                  </SelectSection>,
                  <SelectSection key='owners-section' title='Modelos existentes'>
                    {vehicleModelData.length > 0 ? (
                      vehicleModelData.map(m => (
                        <SelectItem key={m._id} className='text-center'>
                          {m.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key='no-products' className='text-gray-500 text-center'>
                        {t('HomeRental.no_products_available')}
                      </SelectItem>
                    )}
                  </SelectSection>
                ]
              )}
            </Select>
            <div className='flex space-x-2 border p-2'>
              {vehicle.images.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} className='w-16 h-16 object-cover rounded' />
              ))}
            </div>
            <UploadImage setUrl={setImageFiles} form={vehicle} imageFiles={imageFiles} />
            <ModalFooter>
              <Button color='danger' variant='flat' type='button' onPress={() => setOpenUpdateModal(false)}>
                Cancelar
              </Button>
              <Button color='primary' type='submit' isDisabled={submitDisable}>
                Guardar
              </Button>
            </ModalFooter>
          </form>
          {openOwnerModal && <CreateOwnerModal setOwnerModal={setOpenOwnerModal} ownerModal={openOwnerModal} />}
          {openModelModal && <CreateModelModal setModelModal={setOpenModelModal} modelModal={openModelModal} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateVehicle
