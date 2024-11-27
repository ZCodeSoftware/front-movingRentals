import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { signin } from '../../../services/auth/signin/POST/signin.post.service'
import { login } from '../../../services/auth/login/POST/login.post.service'
import { useNavigate } from 'react-router-dom'
import useFormValidations from '../../../hooks/useFormValidation'
import { ISigninForm } from './models/form.interface'
import TextError from '../../../components/textError/TextError'
import { Link } from 'react-router-dom'

const Signin = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false })
  const [isFocused, setIsFocused] = useState({ email: false, password: false, confirmPassword: false })
  const togglePasswordVisibility = () => setIsVisible({ ...isVisible, password: !isVisible.password })
  const toggleConfirmPasswordVisibility = () =>
    setIsVisible({ ...isVisible, confirmPassword: !isVisible.confirmPassword })

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch
  } = useForm<ISigninForm>({ mode: 'onChange', reValidateMode: 'onChange' })

  const { validatePassword, validateEmail } = useFormValidations()

  const onSubmit: SubmitHandler<ISigninForm> = async data => {
    const response = await signin({ email: data.email, password: data.password })
    if (response) {
      await login({ email: data.email, password: data.password })
      navigate('/home')
    }
  }

  const passwordConfirm = watch('password')

  return (
    <main className='w-full h-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full h-screen flex flex-col justify-center items-center '>
        <h1 className='text-3xl text-center p-4'>{t('SignIn.sign_in_title')}</h1>
        <section className='w-full md:w-2/5 p-4 mt-10'>
          <Input
            {...register('email', {
              required: t('SignIn.formValidations.requires.email_require'),
              validate: validateEmail
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
              required: t('SignIn.formValidations.requires.password_require'),
              validate: validatePassword
            })}
            onFocus={() => setIsFocused({ ...isFocused, password: true })}
            onBlur={() => setIsFocused({ ...isFocused, password: false })}
            type={isVisible.password ? 'text' : 'password'}
            label={t('logIn.password')}
            name='password'
            className='p-2'
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={togglePasswordVisibility}
                aria-label='toggle password visibility'
              >
                {isVisible.password ? (
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
          <Input
            {...register('confirmPassword', {
              required: t('SignIn.formValidations.requires.confirm_password_require'),
              validate: value =>
                value === passwordConfirm || t('SignIn.formValidations.requires.confirm_password_match')
            })}
            onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
            onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
            type={isVisible.confirmPassword ? 'text' : 'password'}
            label={t('SignIn.confirm_password')}
            name='confirmPassword'
            className='p-2'
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={toggleConfirmPasswordVisibility}
                aria-label='toggle password visibility'
              >
                {isVisible.confirmPassword ? (
                  <h1 className='text-2xl text-default-400 pointer-events-none'>OO</h1>
                ) : (
                  <h1 className='text-2xl text-default-400 pointer-events-none'>O</h1>
                )}
              </button>
            }
          />
          {isFocused.confirmPassword && errors.confirmPassword && errors.confirmPassword.message && (
            <TextError error={errors.confirmPassword.message} />
          )}
        </section>
        <section className='flex flex-col w-3/4 md:w-2/12'>
          <Button className='p-2' type='submit'>
            {t('SignIn.sign_in')}
          </Button>
          <Button className='mt-4' type='button'>
            {t('logIn.log_in_google')}
          </Button>
        </section>
        <section className='flex flex-col justify-center items-center w-3/4 md:w-2/12 mt-4'>
          <p className='p-2'>{t('SignIn.have_an_account')}</p>
          <Button type='button'>
            <Link to={'/login'}>{t('logIn.log_in')}</Link>
          </Button>
        </section>
      </form>
    </main>
  )
}

export default Signin
