import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input, Button, Spinner, Select, SelectItem, Skeleton } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { signin } from '../../../services/auth/signin/POST/signin.post.service'
import { login } from '../../../services/auth/login/POST/login.post.service'
import { useNavigate } from 'react-router-dom'
import useFormValidations from '../../../hooks/useFormValidation'
import { ISigninForm } from './models/form.interface'
import TextError from '../../../components/textError/TextError'
import { Link } from 'react-router-dom'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { ICountries } from '../../../services/countries/models/countries.interface'
import { getCountries } from '../../../services/countries/GET/countries.get.service'

const Signin = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false })
  const [isFocused, setIsFocused] = useState({ email: false, password: false, confirmPassword: false })
  const [isLoading, setIsLoading] = useState(false)
  const togglePasswordVisibility = () => setIsVisible({ ...isVisible, password: !isVisible.password })
  const toggleConfirmPasswordVisibility = () =>
    setIsVisible({ ...isVisible, confirmPassword: !isVisible.confirmPassword })
  const [loading, setLoading] = useState(true)
  const [countriesData, setCountriesData] = useState<ICountries[]>([])
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch
  } = useForm<ISigninForm>({ mode: 'onChange', reValidateMode: 'onChange' })

  const { validatePassword, validateEmail } = useFormValidations()

  const getCountriesData = async () => {
    const response = await getCountries()
    if (response) {
      const data = Array.isArray(response) ? response : [response]
      setCountriesData(data)
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<ISigninForm> = async data => {
    setIsLoading(true)
    const response = await signin({
      email: data.email,
      password: data.password,
      newsletter: false,
      name: data.name,
      lastName: data.lastName,
      cellphone: data.cellphone,
      address: { countryId: data.address.countryId }
    })
    if (response) {
      await login({ email: data.email, password: data.password })
      navigate('/')
    }
    setIsLoading(false)
  }
  const passwordConfirm = watch('password')

  return (
    <main className='md:w-3/4 h-full'>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full h-full flex flex-col justify-center items-center '>
        <h1 className='text-3xl text-center p-4'>{t('SignIn.sign_in_title')}</h1>
        <section className='w-full md:w-2/5 p-4 mt-10'>
          <Input
            {...register('name', {
              required: t('SignIn.validations.field-require')
            })}
            type='text'
            label='Nombre'
            name='name'
            className='p-2'
          />
          <Input
            {...register('lastName', {
              required: t('SignIn.validations.field-require')
            })}
            type='text'
            label='Apellido'
            name='lastName'
            className='p-2'
          />
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
            {...register('cellphone', {
              required: t('SignIn.validations.field-require')
            })}
            type='number'
            label='Telefono'
            name='cellphone'
            className='p-2'
          />
          <Select
            onChange={e => setValue('address.countryId', e.target.value, { shouldValidate: true })}
            isVirtualized
            label='Country'
            name='country'
            required
            className='h-auto'
            variant='bordered'
            onOpenChange={async isOpen => {
              if (isOpen && countriesData.length === 0) {
                await getCountriesData()
              }
            }}
          >
            {loading ? (
              <SelectItem key='skeleton-1' isDisabled>
                <Skeleton className='w-full h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[80%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[60%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-full h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[80%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[60%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-full h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[80%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[60%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-full h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[80%] h-6 rounded-lg mb-4'></Skeleton>
                <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
              </SelectItem>
            ) : countriesData.length > 0 ? (
              countriesData.map(country => (
                <SelectItem key={country._id} className='text-center'>
                  {i18n.language === 'en' ? country.nameEn : country.nameEs}
                </SelectItem>
              ))
            ) : (
              <SelectItem key='no-data' className='text-gray-500 text-center'>
                {t('HomeRental.no_products_available')}
              </SelectItem>
            )}
          </Select>
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
                  <FaRegEyeSlash className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <FaRegEye className='text-2xl text-default-400 pointer-events-none' />
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
                  <FaRegEyeSlash className='text-2xl text-default-400 pointer-events-none' />
                ) : (
                  <FaRegEye className='text-2xl text-default-400 pointer-events-none' />
                )}
              </button>
            }
          />
          {isFocused.confirmPassword && errors.confirmPassword && errors.confirmPassword.message && (
            <TextError error={errors.confirmPassword.message} />
          )}
        </section>
        <section className='flex flex-col w-3/4 md:w-2/12 m-4'>
          <Button className='p-2' type='submit' isDisabled={isLoading}>
            {isLoading ? <Spinner color='primary' size='sm' /> : t('SignIn.sign_in')}
          </Button>
        </section>
        <section className='flex flex-col justify-center items-center w-3/4 md:w-2/12 mt-4'>
          <p className='p-2'>{t('SignIn.have_an_account')}</p>
          <Button className='bg-buttonPrimary' type='button'>
            <Link to={'/login'}>{t('logIn.log_in')}</Link>
          </Button>
        </section>
      </form>
    </main>
  )
}

export default Signin
