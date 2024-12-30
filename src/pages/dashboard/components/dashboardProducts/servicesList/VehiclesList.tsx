import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllVehicles } from '../../../../../services/products/vehicles/GET/vehicles.get.service'
import { IVehicles } from '../../../../../services/products/models/vehicles.interface'
import UpdateVehicle from '../updateProduct/UpdateVehicle'
import LoaderComponent from '../../../../../utils/loader'

const VehicleList = () => {
  const [loading, setLoading] = useState(true)
  const [vehiclesData, setVehiclesData] = useState<IVehicles[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicles | null>(null)

  const getData = async () => {
    const vehiclesResult = await fetchAllVehicles()
    setVehiclesData(vehiclesResult)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (vehicle: IVehicles) => {
    setSelectedVehicle(vehicle)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {loading ? (
        <LoaderComponent />
      ) : (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Imágen</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Tag</TableColumn>
              <TableColumn>Precio por hora</TableColumn>
              <TableColumn>Precio por 4 horas</TableColumn>
              <TableColumn>Precio por 8 horas</TableColumn>
              <TableColumn>Precio por 24 horas</TableColumn>
              <TableColumn>Categoria</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {vehiclesData.map(v => (
                <TableRow key={v._id}>
                  <TableCell>
                    <img sizes='100px' src={v.images[0]} className='w-[100px] h-[100px]' />
                  </TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.tag}</TableCell>
                  <TableCell>${v.price}</TableCell>
                  <TableCell>${v.pricePer4}</TableCell>
                  <TableCell>${v.pricePer8}</TableCell>
                  <TableCell>${v.pricePer24}</TableCell>
                  <TableCell>{v.category.name}</TableCell>
                  <TableCell>
                    <Button
                      onPress={() => {
                        handleEditClick(v)
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
      {selectedVehicle && openUpdateModal && (
        <UpdateVehicle
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          vehicleData={selectedVehicle}
          vehicleId={selectedVehicle._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default VehicleList
