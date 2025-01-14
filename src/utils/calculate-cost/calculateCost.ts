import { parseZonedDateTime, ZonedDateTime } from '@internationalized/date'
import { IVehicles } from '../../services/products/models/vehicles.interface'

const calculateVehiclePrice = ({
  vehicle,
  dates
}: {
  vehicle: IVehicles
  dates: { start: ZonedDateTime; end: ZonedDateTime }
}) => {
  if (!(dates.start instanceof ZonedDateTime)) {
    dates.start = parseZonedDateTime(dates.start)
  }
  if (!(dates.end instanceof ZonedDateTime)) {
    dates.end = parseZonedDateTime(dates.end)
  }

  const { price, pricePer4, pricePer8, pricePer24 } = vehicle
  if (price === undefined || pricePer4 === undefined || pricePer8 === undefined || pricePer24 === undefined) {
    throw new Error('Los precios del vehículo deben estar definidos.')
  }
  const differenceInMilliseconds = dates.end.toDate().getTime() - dates.start.toDate().getTime()
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60)

  let totalPrice = 0

  if (differenceInHours >= 24 && pricePer24) {
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
  if (hours >= 8 && pricePer8) {
    const fullBlocksOf8 = Math.floor(hours / 8)
    cost += fullBlocksOf8 * pricePer8
    hours %= 8
  }

  if (hours >= 4 && pricePer4) {
    const fullBlocksOf4 = Math.floor(hours / 4)
    cost += fullBlocksOf4 * pricePer4
    hours %= 4
  }

  if (hours > 0) {
    cost += hours * price
  }
  return cost
}

export default calculateVehiclePrice
