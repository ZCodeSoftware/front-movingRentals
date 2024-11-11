import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { login } from '../../../services/auth/login/POST/login.post.service'
import { Button, Input } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { ILoginForm } from './models/form.interface'
import TextError from '../../../components/textError/TextError'
import { Link } from 'react-router-dom'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginForm>({ mode: 'onChange', reValidateMode: 'onChange' })

  const { t } = useTranslation()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isFocused, setIsFocused] = useState({ email: false, password: false })
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible)

  const onSubmit: SubmitHandler<ILoginForm> = async data => {
    await login(data)
  }

  return (
    <main className='w-full h-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full h-screen flex flex-col justify-center items-center '>
        <h1 className='text-3xl text-center p-4'>{t('logIn.log_in_title')}</h1>
        <section className='w-full md:w-2/5 p-4 mt-10'>
          <Input
            {...register('email', {
              required: t('SignIn.formValidations.requires.email_require')
            })}
            onFocus={() => setIsFocused({ ...isFocused, email: true })}
            onBlur={() => setIsFocused({ ...isFocused, email: false })}
            type='email'
            label={t('logIn.email')}
            name='email'
            className='p-2'
          />
          {isFocused.email && errors.email && errors.email.message && <TextError error={errors.email.message} />}
          <Input
            {...register('password', {
              required: t('SignIn.formValidations.requires.password_require')
            })}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            type={isPasswordVisible ? 'text' : 'password'}
            label={t('logIn.password')}
            name='password'
            className='p-2'
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
          {isFocused.password && errors.password && errors.password.message && (
            <TextError error={errors.password.message} />
          )}
        </section>
        <section className='flex flex-col w-3/4 md:w-2/12'>
          <Button className='p-2' type='submit'>
            {t('logIn.log_in')}
          </Button>
          <Button className='mt-4' type='button'>
            {t('logIn.log_in_google')}
          </Button>
        </section>
        <section className='flex flex-col justify-center items-center w-3/4 md:w-2/12 mt-4'>
          <p className='p-2'>{t('logIn.not_registered')}</p>
          <Button type='button'>
            <Link to={'/signin'}>{t('logIn.register')}</Link>
          </Button>
        </section>
      </form>
    </main>
  )
}

export default Login
