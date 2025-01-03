import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchTransfers } from '../../../../../services/transfers/GET/transfers.get.service'
import { ITransfers } from '../../../../../services/transfers/models/transfers.interface'
import UpdateTransfer from '../updateProduct/UpdateTransfer'

const TransfersList = () => {
  const [loading, setLoading] = useState(true)
  const [transfersData, setTransfersData] = useState<ITransfers[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedTransfer, setSelectedTransfer] = useState<ITransfers | null>(null)

  const getData = async () => {
    const transfersResult = await fetchTransfers()
    setTransfersData(transfersResult)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (transfer: ITransfers) => {
    setSelectedTransfer(transfer)
    setOpenUpdateModal(true)
  }

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
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {transfersData.map(v => (
                <TableRow key={v._id}>
                  <TableCell>{v.name}</TableCell>
                  <TableCell>{v.price}</TableCell>
                  <TableCell>{v.estimatedDuration}</TableCell>
                  <TableCell>{v.capacity}</TableCell>
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
      {selectedTransfer && openUpdateModal && (
        <UpdateTransfer
          transferData={selectedTransfer}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          transferId={selectedTransfer._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default TransfersList