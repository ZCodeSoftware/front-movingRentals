import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchTransfers } from '../../../../../services/transfers/GET/transfers.get.service'
import { ITransfers } from '../../../../../services/transfers/models/transfers.interface'

const TransfersList = () => {
  const [loading, setLoading] = useState(true)
  const [transfersData, setTransfersData] = useState<ITransfers[]>([])

  useEffect(() => {
    const getData = async () => {
      const transfersResult = await fetchTransfers()
      setTransfersData(transfersResult)
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
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Precio</TableColumn>
              <TableColumn>Duración estimada</TableColumn>
              <TableColumn>Capacidad</TableColumn>
            </TableHeader>
            <TableBody>
              {transfersData.map(v => (
                <TableRow key={v._id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.price}</TableCell>
                  <TableCell>{v.estimatedDuration}</TableCell>
                  <TableCell>{v.capacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default TransfersList
