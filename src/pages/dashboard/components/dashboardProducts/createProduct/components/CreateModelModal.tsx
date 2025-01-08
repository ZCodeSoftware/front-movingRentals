import { Input, Modal, ModalBody, ModalContent, ModalHeader, Button } from '@nextui-org/react'
import { useState } from 'react'
import { IModelForm } from '../models/model-form.interface'
import { postModel } from '../../../../../../services/vehicle_model/POST/vehicle_model.post.service'

const CreateModelModal = ({ setModelModal, modelModal }: any) => {
  const [model, setModel] = useState<IModelForm>({
    name: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setModel(prevModel => ({
      ...prevModel,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await postModel(model)
    setModel({
      name: ''
    })
    setModelModal(false)
  }

  return (
    <Modal
      isOpen={modelModal}
      onClose={() => setModelModal(false)}
      placement='top-center'
      className='md:w-2/4 h-auto absolute z-50'
    >
      <ModalContent>
        <>
          <ModalHeader className='flex flex-col gap-1'>Crear Nuevo Modelo</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <Input
                autoFocus
                label='Nombre'
                name='name'
                variant='bordered'
                value={model.name}
                onChange={handleChange}
              />
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
        </>
      </ModalContent>
    </Modal>
  )
}

export default CreateModelModal
