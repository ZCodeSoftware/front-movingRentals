import { useState } from 'react'
import { login } from '../../../services/auth/login/POST/login.post.service'
import { validateEmail } from '../utils/validations/email-validation'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const { t } = useTranslation()
  const [disabled, setDisabled] = useState(true)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const navigate = useNavigate()
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    if (form.email && validateEmail(form.email) && form.password) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }

  const handleSubmit = async () => {
    try {
      await login(form)
      navigate('/home')
    } catch (error) {
      throw error
    }
  }

  return (
    <main className='w-full h-screen'>
      <form className='w-full h-screen flex flex-col justify-center items-center '>
        <h1 className='text-3xl text-center p-4'>{t('logIn.log_in_title')}</h1>
        <section className='w-full md:w-2/5 p-4 mt-10'>
          <Input
            type='email'
            label={t('logIn.email')}
            name='email'
            className='p-2'
            value={form.email}
            onChange={handleChange}
          />
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            label={t('logIn.password')}
            name='password'
            className='p-2'
            value={form.password}
            onChange={handleChange}
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={toggleVisibility}
                aria-label='toggle password visibility'
              >
                {isPasswordVisible ? (
                  <h1 className='text-2xl text-default-400 pointer-events-none'>OO</h1>
                ) : (
                  <h1 className='text-2xl text-default-400 pointer-events-none'>O</h1>
                )}
              </button>
            }
          />
        </section>
        <section className='flex flex-col w-3/4 md:w-2/12'>
          <Button
            className={`p-2 ${disabled ? 'bg-gray-200 cursor-not-allowed hover:bg-gray-200' : 'bg-blue-500'}`}
            onClick={handleSubmit}
            disabled={disabled}
            data-hover={disabled}
            disableAnimation={disabled}
          >
            {t('logIn.log_in')}
          </Button>
          <Button className='mt-4' type='button'>
            {t('logIn.log_in_google')}
          </Button>
        </section>
        <section className='flex flex-col justify-center items-center w-3/4 md:w-2/12 mt-4'>
          <p className='p-2'>{t('logIn.not_registered')}</p>
          <Button type='button'>{t('logIn.register')}</Button>
        </section>
      </form>
    </main>
  )
}

export default Login
