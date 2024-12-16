import React, { useState } from 'react'
import { Input, Button, Select, SelectItem, SelectSection, Skeleton, Textarea } from '@nextui-org/react'
import { IVehicleForm } from './models/vehicles-form.interface'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import { ICategories } from '../../../../../services/categories/models/categories.interface'
import { useTranslation } from 'react-i18next'
import { postVehicle } from '../../../../../services/products/vehicles/POST/vehicles.post.service'
import uploadToCloudinary from '../../tempUploadImage/uploadImage'
import { IVehicleOwners } from '../../../../../services/owners/models/vehicle-owners.interface'
import { fetchAllVehicleOwners } from '../../../../../services/owners/GET/vehicle-owners.get.service'
import CreateOwnerModal from './components/CreateOwnerModal'

const CreateVehicle: React.FC = () => {
  const [vehicle, setVehicle] = useState<IVehicleForm>({
    name: '',
    description: '',
    category: '',
    images: [],
    owner: '',
    price: 0,
    pricePer4: 0,
    pricePer8: 0,
    pricePer24: 0,
    capacity: 0,
    minRentalHours: 0
  })
  const [categoriesData, setCategoriesData] = useState<ICategories[]>([])
  const [vehicleOwnersData, setVehicleOwnersData] = useState<IVehicleOwners[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [openOwnerModal, setOpenOwnerModal] = useState(false)
  const { t } = useTranslation()

  const filterCategories = categoriesData.filter(p => p.name != 'Tours')

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles([...e.target.files])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setVehicle(prevVehicle => ({
      ...prevVehicle,
      [name]: numberFields.includes(name) ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const uploadedImages = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)))
    const validImages = uploadedImages.filter(url => url !== null) as string[]
    const vehicleData = {
      ...vehicle,
      images: validImages
    }
    await postVehicle(vehicleData)
    setVehicle({
      name: '',
      description: '',
      category: '',
      images: [],
      owner: '',
      price: 0,
      pricePer4: 0,
      pricePer8: 0,
      pricePer24: 0,
      capacity: 0,
      minRentalHours: 0
    })
  }
  return (
    <div className='max-w-fit mx-auto p-6 bg-white rounded-xl shadow-md space-y-4'>
      <h2 className='text-2xl font-bold text-center mb-4'>Crear Nuevo Vehiculo</h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input label='Nombre del Producto' name='name' onChange={handleChange} required fullWidth variant='bordered' />

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
          value={vehicle.category}
          name='category'
          selectedKeys={[vehicle.category]}
          onChange={handleChange}
          required
          variant='bordered'
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
            onChange={handleChange}
            fullWidth
            min={0}
            variant='bordered'
          />
          <Input
            label='Precio por 4 horas'
            name='pricePer4'
            type='number'
            onChange={handleChange}
            fullWidth
            min={0}
            variant='bordered'
          />
          <Input
            label='Precio por 8 horas'
            name='pricePer8'
            type='number'
            onChange={handleChange}
            fullWidth
            min={0}
            variant='bordered'
          />
          <Input
            label='Precio por 24 horas'
            name='pricePer24'
            type='number'
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
            onChange={handleChange}
            fullWidth
            min={0}
            variant='bordered'
          />
          <Input
            label='Capacidad'
            name='capacity'
            type='number'
            onChange={handleChange}
            fullWidth
            min={0}
            variant='bordered'
          />
        </div>

        <Select
          label='Dueño'
          value={vehicle.owner}
          name='owner'
          selectedKeys={[vehicle.owner]}
          onChange={handleChange}
          required
          variant='bordered'
          onOpenChange={async isOpen => {
            if (isOpen) {
              await getVehicleOwners()
            }
          }}
          renderValue={() => {
            const renderValue = vehicleOwnersData.find(o => o._id === vehicle.owner && o.name !== 'Crear nuevo dueño')
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

        <Input
          label='Subir Imágen'
          className='p-6'
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          fullWidth
          variant='bordered'
        />

        <Button type='submit' color='primary' fullWidth className='mt-4'>
          Crear Vehículo
        </Button>
      </form>
      {openOwnerModal && <CreateOwnerModal setOwnerModal={setOpenOwnerModal} ownerModal={openOwnerModal} />}
    </div>
  )
}

export default CreateVehicle
