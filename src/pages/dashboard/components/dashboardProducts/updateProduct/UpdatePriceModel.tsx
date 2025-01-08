import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Button,
  Select,
  SelectItem,
  Skeleton
} from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { putModel } from '../../../../../services/vehicle_model/PUT/vehicle_model.put.service'
import { IVehicle_model } from '../../../../../services/vehicle_model/models/vehicle_model.interface'
import { fetchAllModels } from '../../../../../services/vehicle_model/GET/vehicle_model.get.service'
import { useTranslation } from 'react-i18next'

const UpdateModelModal = ({ setModelModal, modelModal, onUpdate }: any) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [models, setModels] = useState<IVehicle_model[]>([])
  const [selectedModel, setSelectedModel] = useState({
    _id: '',
    price: undefined,
    pricePer4: undefined,
    pricePer8: undefined,
    pricePer24: undefined
  })
  const [fieldErrors, setFieldErrors] = useState({
    price: false,
    pricePer4: false,
    pricePer8: false,
    pricePer24: false
  })

  const getVehicleModels = async () => {
    const response = await fetchAllModels()
    if (response) {
      setModels(response)
    }
    setLoading(false)
  }

  const validateForm = () => {
    const errors = {
      price: !selectedModel.price || selectedModel.price <= 0,
      pricePer4: !selectedModel.pricePer4 || selectedModel.pricePer4 <= 0,
      pricePer8: !selectedModel.pricePer8 || selectedModel.pricePer8 <= 0,
      pricePer24: !selectedModel.pricePer24 || selectedModel.pricePer24 <= 0
    }

    setFieldErrors(errors)

    return !Object.values(errors).every(isInvalid => isInvalid)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSelectedModel(prevModel => ({
      ...prevModel,
      [name]: value ? Number(value) : undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      const modelData = {
        price: Number(selectedModel.price),
        pricePer4: Number(selectedModel.pricePer4),
        pricePer8: Number(selectedModel.pricePer8),
        pricePer24: Number(selectedModel.pricePer24)
      }

      const res = await putModel(selectedModel._id, modelData)
      if (res.status === 200) {
        onUpdate()
        setSelectedModel({
          _id: '',
          price: undefined,
          pricePer4: undefined,
          pricePer8: undefined,
          pricePer24: undefined
        })
        setModelModal(false)
      }
    }
  }

  useEffect(() => {
    if (modelModal) {
      getVehicleModels()
    }
  }, [modelModal])

  return (
    <Modal
      isOpen={modelModal}
      onClose={() => setModelModal(false)}
      placement='top-center'
      className='md:w-2/4 h-auto absolute z-50'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Modificar precio por modelo</ModalHeader>
        <ModalBody>
          <Select
            label='Nombre'
            value={selectedModel._id || ''}
            onChange={e => {
              setSelectedModel({ ...selectedModel, _id: e.target.value })
            }}
            required
            variant='bordered'
            onOpenChange={async isOpen => {
              if (isOpen) {
                await getVehicleModels()
              }
            }}
          >
            {loading ? (
              <SelectItem key='skeleton-1' isDisabled>
                <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
                <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
                <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
              </SelectItem>
            ) : models.length > 0 ? (
              models.map(c => (
                <SelectItem key={c._id} value={c._id} className='text-center'>
                  {c.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem key='no-products' className='text-gray-500 text-center'>
                {t('HomeRental.no_products_available')}
              </SelectItem>
            )}
          </Select>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {selectedModel._id && (
              <>
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
                {fieldErrors.price && fieldErrors.pricePer4 && fieldErrors.pricePer8 && fieldErrors.pricePer24 ? (
                  <p className='text-danger'>Debe agregar por lo menos un precio</p>
                ) : (
                  ''
                )}
              </>
            )}
            <div className='flex justify-around p-4'>
              <Button color='danger' variant='flat' type='button' onPress={() => setModelModal(false)}>
                Cancelar
              </Button>
              <Button color='primary' type='submit'>
                Guardar
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default UpdateModelModal
