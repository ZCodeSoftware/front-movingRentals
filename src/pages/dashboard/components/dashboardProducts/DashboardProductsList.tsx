import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableColumn,
  TableRow
} from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllTours } from '../../../../services/products/tours/GET/tours.get.service'
import { ITours } from '../../../../services/products/models/tours.interface'
import { fetchAllVehicles } from '../../../../services/products/vehicles/GET/vehicles.get.service'
import { IVehicles } from '../../../../services/products/models/vehicles.interface'

const DashboardProducts = () => {
  const [view, setView] = useState('vehicles')
  const [loading, setLoading] = useState(true)
  const [toursData, setToursData] = useState<ITours[]>([])
  const [vehiclesData, setVehiclesData] = useState<IVehicles[]>([])

  useEffect(() => {
    const getData = async () => {
      const toursResult = await fetchAllTours()
      const vehiclesResult = await fetchAllVehicles()
      setToursData(toursResult)
      setVehiclesData(vehiclesResult)
      setLoading(false)
    }

    getData()
  }, [])

  return (
    <div>
      <Navbar isBordered className='w-full flex justify-center'>
        <NavbarContent>
          <NavbarItem className='w-full flex justify-evenly'>
            <Button
              color={view === 'vehicles' ? 'primary' : 'default'}
              variant={view === 'vehicles' ? 'solid' : 'light'}
              onClick={() => setView('vehicles')}
            >
              Vehículos
            </Button>
            <Button
              color={view === 'tours' ? 'primary' : 'default'}
              variant={view === 'tours' ? 'solid' : 'light'}
              onClick={() => setView('tours')}
            >
              Tours
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {!loading && (
        <div>
          {view === 'vehicles' ? (
            <div className='w-full h-full flex justify-center items-center py-4'>
              <Table aria-label='Tabla de usuarios'>
                <TableHeader>
                  <TableColumn>Imágen</TableColumn>
                  <TableColumn>Precio</TableColumn>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Categoria</TableColumn>
                </TableHeader>
                <TableBody>
                  {vehiclesData.map(v => (
                    <TableRow key={v._id}>
                      <TableCell>
                        <img src={v.images[0]} />
                      </TableCell>
                      <TableCell>{v.price}</TableCell>
                      <TableCell>{v.name}</TableCell>
                      <TableCell>{v.category.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='w-full h-full flex justify-center items-center py-4'>
              <Table aria-label='Tabla de usuarios'>
                <TableHeader>
                  <TableColumn>Imágen</TableColumn>
                  <TableColumn>Precio</TableColumn>
                  <TableColumn>Nombre</TableColumn>
                  <TableColumn>Descripcion</TableColumn>
                  <TableColumn>Recomendaciones</TableColumn>
                  <TableColumn>Incluye...</TableColumn>
                </TableHeader>
                <TableBody>
                  {toursData.map(t => (
                    <TableRow key={t._id}>
                      <TableCell>{t._id}</TableCell>
                      <TableCell>{t._id}</TableCell>
                      <TableCell>{t._id}</TableCell>
                      <TableCell>{t._id}</TableCell>
                      <TableCell>{t._id}</TableCell>
                      <TableCell>{t._id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DashboardProducts
