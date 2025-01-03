import { AppApiGateWayNoJWT } from '../../app.api.gateway-no-jwt'
import { IContactForm } from '../models/contact-form.interface'

export const postContactForm = async (data: IContactForm) => {
  try {
    await AppApiGateWayNoJWT.post('/notification/contact-user', data)
  } catch (error) {
    console.error('Error al enviar mail de contacto', error)
  }
}
