import { useEffect, useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { fetchBookingByUserId } from '../../../services/booking/GET/booking.get.service'
import { IBooking } from '../../../services/booking/models/booking.interface'
import RentalProcess from '../../../components/timeLine'
import { ICartTours, ICartTranfer, ICartVehicles } from '../../../services/cart/models/cart.interface'

const ReservationsModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { t } = useTranslation()
  const [bookingData, setBookingData] = useState<IBooking[]>([])

  const getData = async () => {
    const result = await fetchBookingByUserId()
    setBookingData(result)
  }

  useEffect(() => {
    isOpen && getData()
  }, [isOpen])

  const formatDate = (dateString: string) => {
    return dateString.replace(/T(\d{2}:\d{2}):\d{2}\.\d{3}Z$/, ' $1')
  }

  return (
    <>
      <Button onPress={onOpen} className='w-64 bg-buttonPrimary'>
        {t('Profile.reservations.title')}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'> {t('Profile.reservations.title')}</ModalHeader>
              {bookingData &&
                bookingData.map(booking => {
                  const parsedCart = booking.cart && JSON.parse(booking.cart)
                  return (
                    <ModalBody>
                      <Card>
                        <Table className='max-h-60 overflow-y-auto' isHeaderSticky>
                          <TableHeader>
                            <TableColumn>Nombre</TableColumn>
                            <TableColumn>Precio</TableColumn>
                            <TableColumn>Fecha de Inicio</TableColumn>
                            <TableColumn>Fecha de Fin</TableColumn>
                          </TableHeader>
                          <TableBody className='overflow-y-auto'>
                            {parsedCart.vehicles.length > 0 &&
                              parsedCart.vehicles.map((v: ICartVehicles) => (
                                <TableRow key={v.vehicle._id}>
                                  <TableCell>{v.vehicle.name}</TableCell>
                                  <TableCell>${v.vehicle.price}</TableCell>
                                  <TableCell>{formatDate(v.dates.start.toString())}</TableCell>
                                  <TableCell>{formatDate(v.dates.end.toString())}</TableCell>
                                </TableRow>
                              ))}
                            {parsedCart.tours.length > 0 &&
                              parsedCart.tours.map((t: ICartTours) => (
                                <TableRow key={t.tour._id}>
                                  <TableCell>{t.tour.name}</TableCell>
                                  <TableCell>${t.tour.price}</TableCell>
                                  <TableCell>{formatDate(t.date.toString())}</TableCell>
                                </TableRow>
                              ))}
                            {parsedCart.transfer.length > 0 &&
                              parsedCart.transfer.map((tr: ICartTranfer) => (
                                <TableRow key={tr.transfer._id}>
                                  <TableCell>{tr.transfer.name}</TableCell>
                                  <TableCell>${tr.transfer.price}</TableCell>
                                  <TableCell>{formatDate(tr.date.toString())}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Card>
                      <RentalProcess />
                    </ModalBody>
                  )
                })}
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  {t('Profile.reservations.close_button')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ReservationsModal
