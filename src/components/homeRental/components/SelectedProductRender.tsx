import { useState } from 'react'
import { Card, CardBody, Image } from '@nextui-org/react'
import { ISelectData, ISelectItems } from '../models/Select-data'
import { useEffect } from 'react'
import ProductDetailModal from '../../../pages/list-by-category/components/ProductDetailModal'
import { t } from 'i18next'

const SelectedProductRender = ({ products, setSelectData, selectData }: any) => {
  const [openModal, setOpenModal] = useState<{ [key: string]: boolean }>({})
  const calculatePrice = ({ vehicle, dates }: ISelectItems) => {
    if (!dates.start || !dates.end) {
      throw new Error('Las fechas de inicio y fin deben estar definidas.')
    }
    const { price, pricePer4, pricePer8, pricePer24 } = vehicle
    if (price === undefined || pricePer4 === undefined || pricePer8 === undefined || pricePer24 === undefined) {
      throw new Error('Los precios del vehículo deben estar definidos.')
    }
    const differenceInMilliseconds = dates.end.toDate().getTime() - dates.start.toDate().getTime()
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60)

    let totalPrice = 0

    if (differenceInHours >= 24) {
      const fullDays = Math.floor(differenceInHours / 24)
      totalPrice += fullDays * pricePer24
      const remainingHours = differenceInHours % 24

      totalPrice += calculateRemainingPrice(remainingHours, price, pricePer4, pricePer8)
    } else {
      totalPrice += calculateRemainingPrice(differenceInHours, price, pricePer4, pricePer8)
    }
    return totalPrice
  }

  const calculateRemainingPrice = (hours: number, price: number, pricePer4: number, pricePer8: number) => {
    let cost = 0
    if (hours >= 8) {
      const fullBlocksOf8 = Math.floor(hours / 8)
      cost += fullBlocksOf8 * pricePer8
      hours %= 8
    }

    if (hours >= 4) {
      const fullBlocksOf4 = Math.floor(hours / 4)
      cost += fullBlocksOf4 * pricePer4
      hours %= 4
    }

    if (hours > 0) {
      cost += hours * price
    }

    return cost
  }

  useEffect(() => {
    const updateData = selectData.selectedItems.map((item: ISelectItems) => {
      const totalPrice = calculatePrice({ vehicle: item.vehicle, dates: item.dates })

      return { ...item, total: totalPrice }
    })

    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedItems: updateData
    }))
  }, [selectData.selectedItems.length])

  const handleOpenModal = (id: string) => {
    setOpenModal((prev: any) => ({ ...prev, [id]: true }))
  }

  const handleCloseModal = (id: string) => {
    setOpenModal((prev: any) => ({ ...prev, [id]: false }))
  }

  return (
    <>
      {products.length > 0 && (
        <div className=' overflow-y-auto max-h-52  scroll-container'>
          <h1 className='bg-buttonPrimary p-1 rounded-medium pl-2'>{t('HomeRental.selected_products')}</h1>
          {products.map((p: any) => (
            <>
              {p.tour ? (
                <Card className='m-2' isPressable onPress={() => handleOpenModal(p.tour._id)}>
                  <CardBody className='flex flex-row justify-center items-center'>
                    <Image src={p.tour.images[0] || ''} width='200px' />
                    <div className='mx-2'>
                      <h1 className='font-bold'>{p.tour.name || ''}</h1>
                      <p>${p.tour.price || 0}</p>
                    </div>
                  </CardBody>
                  {openModal[p.tour._id] && (
                    <ProductDetailModal product={p.tour} setOpenModal={() => handleCloseModal(p.tour._id)} />
                  )}
                </Card>
              ) : (
                <Card className='m-2' isPressable onPress={() => handleOpenModal(p.vehicle._id)}>
                  <CardBody className='flex flex-row justify-center items-center'>
                    <Image src={p.vehicle.images[0] || ''} width='200px' />
                    <div className='mx-2'>
                      <h1 className='font-bold'>{p.vehicle.name || ''}</h1>
                      <p>${calculatePrice({ vehicle: p.vehicle, dates: p.dates })}</p>
                    </div>
                  </CardBody>
                  {openModal[p.vehicle._id] && (
                    <ProductDetailModal product={p.vehicle} setOpenModal={() => handleCloseModal(p.vehicle._id)} />
                  )}
                </Card>
              )}
            </>
          ))}
        </div>
      )}
    </>
  )
}

export default SelectedProductRender
