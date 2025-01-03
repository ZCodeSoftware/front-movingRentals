export interface IAuth {
  email: string
  password: string
  newsletter?: boolean
  name?: string
  lastName?: string
  cellphone?: number
  address?: { countryId: string }
}
