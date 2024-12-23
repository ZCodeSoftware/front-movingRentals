export interface IBooking {
  _id: string
  cart: string
  limitCancellation?: string
  paymentMethod: { _id: string; name: string }
}
