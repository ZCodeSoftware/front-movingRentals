import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Tooltip, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllTours } from '../../../../../services/products/tours/GET/tours.get.service'
import { ITours } from '../../../../../services/products/models/tours.interface'
import UpdateTour from '../updateProduct/UpdateTours'

const ToursList = () => {
  const [loading, setLoading] = useState(true)
  const [toursData, setToursData] = useState<ITours[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState<ITours | null>(null)

  const getData = async () => {
    const toursResult = await fetchAllTours()
    setToursData(toursResult)
    setLoading(false)
  }
  
  useEffect(() => {
  getData()
}, [])

  const handleEditClick = (tour: ITours) => {
    setSelectedTour(tour)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Imágen</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Precio</TableColumn>
              <TableColumn>Descripcion</TableColumn>
              <TableColumn>Itinerario</TableColumn>
              <TableColumn>Capacidad máxima</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {toursData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>
                    <img sizes='100px' src={t.images[0]} className='w-[100px] h-[100px]' />
                  </TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.price}</TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        <div className='w-48 max-h-48 overflow-y-auto overflow-x-hidden px-2 py-2 break-wordsbreak-words whitespace-pre-line'>
                          {JSON.parse(t.description)}
                        </div>
                      }
                      placement='bottom'
                      showArrow
                    >
                      <div className='text-ellipsis max-w-48 text-nowrap overflow-hidden'>
                        {JSON.parse(t.description)}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        <div className='w-48 max-h-48 overflow-y-auto overflow-x-hidden px-2 py-2 break-wordsbreak-words whitespace-pre-line'>
                          {JSON.parse(t.itinerary)}
                        </div>
                      }
                      placement='bottom'
                      showArrow
                    >
                      <div className='text-ellipsis max-w-48 text-nowrap overflow-hidden'>
                        {JSON.parse(t.itinerary)}
                      </div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{t.capacity}</TableCell>
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
      {selectedTour && openUpdateModal && (
<UpdateTour
  tourData={selectedTour}
  openUpdateModal={openUpdateModal}
  setOpenUpdateModal={setOpenUpdateModal}
  tourId={selectedTour._id}
  onUpdate={getData}
/>
)}
    </>
  )
}

export default ToursList