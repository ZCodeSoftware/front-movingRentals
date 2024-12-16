import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllVehicles } from '../../../../../services/products/vehicles/GET/vehicles.get.service'
import { IVehicles } from '../../../../../services/products/models/vehicles.interface'

const VehicleList = () => {
  const [loading, setLoading] = useState(true)
  const [vehiclesData, setVehiclesData] = useState<IVehicles[]>([])

  useEffect(() => {
    const getData = async () => {
      const vehiclesResult = await fetchAllVehicles()
      setVehiclesData(vehiclesResult)
      setLoading(false)
    }

    getData()
  }, [])

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Imágen</TableColumn>
              <TableColumn>Nombre</TableColumn>
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
                    <img sizes='100px' src={v.images[0]} className='h-[100px]' />
                  </TableCell>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.price}</TableCell>
                  <TableCell>{v.pricePer4}</TableCell>
                  <TableCell>{v.pricePer8}</TableCell>
                  <TableCell>{v.pricePer24}</TableCell>
                  <TableCell>{v.category.name}</TableCell>
                  <TableCell>
                    <Button>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default VehicleList
