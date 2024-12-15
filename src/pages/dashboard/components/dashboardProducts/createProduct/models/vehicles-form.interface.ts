export interface IVehicleForm {
  name: string
  images: string[]
  category: string
  price: number
  pricePer4?: number
  pricePer8?: number
  pricePer24?: number
  capacity: number
  minRentalHours: number
  description: string
  owner: string
}
