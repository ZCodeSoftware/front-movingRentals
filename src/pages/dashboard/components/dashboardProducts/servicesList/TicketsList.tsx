import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Tooltip, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { fetchAllTickets } from '../../../../../services/products/tickets/GET/tickets.get.service'
import { ITickets } from '../../../../../services/products/models/tickets.interface'
import UpdateTicket from '../updateProduct/UpdateTicket'

const TicketsList = () => {
  const [loading, setLoading] = useState(true)
  const [ticketsData, setTicketsData] = useState<ITickets[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ITickets | null>(null)

  const getData = async () => {
    const ticketResult = await fetchAllTickets()
    setTicketsData(ticketResult)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (ticket: ITickets) => {
    setSelectedTicket(ticket)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>MovingPrice</TableColumn>
              <TableColumn>cenotePrice</TableColumn>
              <TableColumn>Precio total</TableColumn>
              <TableColumn>Descripcion</TableColumn>
              <TableColumn>Locación</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {ticketsData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.movingPrice}</TableCell>
                  <TableCell>{t.cenotePrice}</TableCell>
                  <TableCell>{t.totalPrice}</TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        <div className='w-48 max-h-48 overflow-y-auto overflow-x-hidden px-2 py-2 break-wordsbreak-words whitespace-pre-line'>
                          {t.description}
                        </div>
                      }
                      placement='bottom'
                      showArrow
                    >
                      <div className='text-ellipsis max-w-48 text-nowrap overflow-hidden'>{t.description}</div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{t.location}</TableCell>
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
      {selectedTicket && openUpdateModal && (
        <UpdateTicket
          ticketData={selectedTicket}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          ticketId={selectedTicket._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default TicketsList
