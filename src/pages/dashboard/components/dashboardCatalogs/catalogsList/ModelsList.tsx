import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { ICategories } from '../../../../../services/categories/models/categories.interface'
import { fetchAllModels } from '../../../../../services/vehicle_model/GET/vehicle_model.get.service'
import { IVehicle_model } from '../../../../../services/vehicle_model/models/vehicle_model.interface'
import UpdateModel from '../updateCatalogs/updateModel'

const ModelsList = () => {
  const [loading, setLoading] = useState(true)
  const [ModelsData, setModelsData] = useState<IVehicle_model[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedModel, setselectedModel] = useState<ICategories | null>(null)

  const getData = async () => {
    const result = await fetchAllModels()
    setModelsData(result)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (model: IVehicle_model) => {
    setselectedModel(model)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table>
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {ModelsData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>
                    <Button
                      onPress={() => {
                        handleEditClick(t)
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedModel && openUpdateModal && (
        <UpdateModel
          modelData={selectedModel}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          modelId={selectedModel._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default ModelsList
