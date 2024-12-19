import { useTranslation } from 'react-i18next'

const useFormValidations = () => {
  const { t } = useTranslation()

  const traduction = {
    password: {
      hasUpperCase: t('SignIn.formValidations.valid.uppercase'),
      hasLowerCase: t('SignIn.formValidations.valid.lowercase'),
      hasNumber: t('SignIn.formValidations.valid.number'),
      hasSpecialChar: t('SignIn.formValidations.valid.special_character'),
      minLength: t('SignIn.formValidations.valid.characters')
    },
    email: {
      hasAt: t('SignIn.formValidations.valid.@'),
      hasPoint: t('SignIn.formValidations.valid.dot')
    }
  }

  const validatePassword = {
    hasUpperCase: (value?: string) => (value?.match(/[A-Z]/) ? true : 'Debe contener al menos una letra mayúscula.'),
    hasLowerCase: (value?: string) => (value?.match(/[a-z]/) ? true : 'Debe contener al menos una letra minúscula.'),
    hasNumber: (value?: string) => (value?.match(/[0-9]/) ? true : 'Debe contener al menos un número.'),
    hasSpecialChar: (value?: string) =>
      value?.match(/[!@#$%^&*(),.?":{}|<>_-]/) ? true : 'Debe contener al menos un carácter especial.',
    minLength: (value?: string) => (value && value.length >= 8 ? true : 'Debe tener al menos 8 caracteres.')
  }

  const validateEmail = {
    hasAt: (value: string | undefined) => value?.includes('@') || traduction.email.hasAt,
    hasPoint: (value: string | undefined) => value?.includes('.') || traduction.email.hasPoint
  }

  return { validatePassword, validateEmail }
}

export default useFormValidations
