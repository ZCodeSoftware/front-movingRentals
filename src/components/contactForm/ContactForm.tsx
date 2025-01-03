import { useState } from 'react'
import { Input, Textarea } from '@nextui-org/react'
import ButtonLoader from './components/ButtonLoader'
import { postContactForm } from '../../services/contact-form/POST/contact-form.post.service'
const ContactForm = () => {
  const [message, setMessage] = useState({
    name: '',
    email: '',
    subject: '',
    text: ''
  })
  const [buttonLoad, setButtonLoad] = useState({
    error: false,
    confirm: false,
    load: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMessage(prevMessage => ({
      ...prevMessage,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setButtonLoad({ ...buttonLoad, load: true })
    try {
      await postContactForm(message)
      setButtonLoad({ ...buttonLoad, load: false })
      setButtonLoad({ ...buttonLoad, confirm: true })
      setTimeout(() => {
        setButtonLoad({ ...buttonLoad, confirm: false })
      }, 3000)
      setMessage({ name: '', email: '', text: '', subject: '' })
    } catch (error) {
      setButtonLoad({ ...buttonLoad, error: true })
      console.error('Error al enviar el correo electrónico:', error)
      setTimeout(() => {
        setButtonLoad({ ...buttonLoad, confirm: false })
        setButtonLoad({ ...buttonLoad, load: false })
        setButtonLoad({ ...buttonLoad, error: false })
      }, 3000)
    }
  }

  return (
    <div className='w-full h-screen flex md:flex-row flex-col justify-center items-center p-4 md:space-x-24'>
      <form className='md:w-2/6 w-full space-y-4' onSubmit={handleSubmit}>
        <h1 className='text-center text-2xl p-4'>Contacto</h1>
        <Input label='Nombre' name='name' onChange={handleChange} variant='bordered' />
        <Input label='Email' type='email' name='email' onChange={handleChange} variant='bordered' />
        <Input label='Asunto' name='subject' onChange={handleChange} variant='bordered' />
        <Textarea label='Mensaje' name='message' onChange={handleChange} variant='bordered' />
        <div className='w-full flex justify-center'>
          <ButtonLoader
            buttonLoad={buttonLoad}
            loadStr={'Enviando...'}
            loadEndStr={'Mensaje enviado'}
            loadErrorStr={'Error al enviar mensaje'}
          />
        </div>
      </form>
      <div className='md:w-2/6'>
        <h1 className='text-center text-2xl p-4'>Nuestra sucursal</h1>
        <iframe
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3744.4529888191732!2d-87.4721474!3d20.198488899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4fd7b93dc31b11%3A0x2a117cf83d1748ae!2sMoving%2FLa%20Veleta%20Tulum%20store-Atv%20rental%2C%20Atv%20tours%2C%20Scooter%20rental%20and%20Bikes*21!5e0!3m2!1ses!2sar!4v1734896103773!5m2!1ses!2sar'
          width='100%'
          height='500'
          style={{ border: '1px solid gray', borderRadius: '10px' }}
          allowFullScreen
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          title='Google Maps'
        ></iframe>
      </div>
    </div>
  )
}

export default ContactForm