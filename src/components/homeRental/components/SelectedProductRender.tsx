import { Card, CardBody, Image } from '@nextui-org/react'
import { HOME_CARDS_CONSTANTS } from '../../../pages/home/constants/home.constants'
import { ISelectData, ISelectItems } from '../models/Select-data'

const SelectedProductRender = ({ products, setSelectData, selectData }: any) => {
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
    const updateData = selectData.selectedItem.map((item: ISelectItems) => {
      if (item.vehicle._id === vehicle._id) {
        return { ...item, total: totalPrice }
      }
      return item
    })
    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedItem: updateData
    }))
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

  return (
    <>
      {products.length > 0 && (
        <div className=' overflow-y-auto max-h-52'>
          <h1>Productos seleccionados</h1>
          {products.map((p: any) => (
            <>
              {p.hasOwnProperty(HOME_CARDS_CONSTANTS.ITINERARY) ? (
                <Card className='m-2'>
                  <CardBody className='flex flex-row justify-center items-center'>
                    <Image src={p.images[0]} width='200px' />
                    <div className='mx-2'>
                      <h1 className='font-bold'>{p.name}</h1>
                      <p>${p.price}</p>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card className='m-2'>
                  <CardBody className='flex flex-row justify-center items-center'>
                    <Image src={p.vehicle.images[0]} width='200px' />
                    <div className='mx-2'>
                      <h1 className='font-bold'>{p.vehicle.name}</h1>
                      <p>${calculatePrice({ vehicle: p.vehicle, dates: p.dates })}</p>
                    </div>
                  </CardBody>
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
