export interface ISigninForm {
  name: string
  lastName: string
  email: string
  cellphone: number
  password: string
  confirmPassword: string
  country: string
  address: {
    countryId: string
  }
}
