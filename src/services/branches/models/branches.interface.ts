import { ITours } from '../../products/models/tours.interface'
import { IVehicles } from '../../products/models/vehicles.interface'
import { IUser } from '../../users/models/user.interface'

interface IAddress {
  city: string
  coords: { lat: number; lon: number; _id: string }
  country: string
  number: string
  postalCode: string
  state: string
  street: string
  _id: string
}

export interface IBranches {
  name: string
  _id: string
  address: IAddress
  vehicles: IVehicles[]
  tours: ITours[]
  users: IUser[]
}
