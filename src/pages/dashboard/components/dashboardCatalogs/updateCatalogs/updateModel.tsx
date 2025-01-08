import React, { useEffect, useState } from 'react'
import { Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { IUpdateModel } from './models/update-model-props.interface'
import { IModelForm } from '../createCatalogs/models/model-form.interface'
import { putModelName } from '../../../../../services/vehicle_model/PUT/vehicle_model.put.service'

const UpdateModel: React.FC<IUpdateModel> = ({ openUpdateModal, setOpenUpdateModal, modelData, modelId, onUpdate }) => {
  const [model, setModel] = useState<IModelForm>({
    name: modelData?.name || ''
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
    setModel(prevModel => ({
      ...prevModel,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await putModelName(modelId, model)
    onUpdate()
    setOpenUpdateModal(false)
    setModel({
      name: modelData?.name || ''
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
          <h2 className='text-2xl font-bold text-center mb-4'>Modificar modelo</h2>
        </ModalHeader>
        <ModalBody>
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

export default UpdateModel
