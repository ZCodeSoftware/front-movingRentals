export interface IProducts {
  _id: string
  category: { _id: string; name: string }
  name: string
  image: string
  specs?: {
    engine: string
    maxSpeed: string
    passenger: string
  }
  price: number
}
