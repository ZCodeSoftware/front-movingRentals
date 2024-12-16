import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Tooltip } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllTours } from '../../../../../services/products/tours/GET/tours.get.service'
import { ITours } from '../../../../../services/products/models/tours.interface'

const ToursList = () => {
  const [loading, setLoading] = useState(true)
  const [toursData, setToursData] = useState<ITours[]>([])

  useEffect(() => {
    const getData = async () => {
      const toursResult = await fetchAllTours()
      setToursData(toursResult)
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
              <TableColumn>Precio</TableColumn>
              <TableColumn>Descripcion</TableColumn>
              <TableColumn>Itinerario</TableColumn>
              <TableColumn>Capacidad máxima</TableColumn>
            </TableHeader>
            <TableBody>
              {toursData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>
                    <img sizes='100px' src={t.images[0]} className='h-[100px]' />
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default ToursList
