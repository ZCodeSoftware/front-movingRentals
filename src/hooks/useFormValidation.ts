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
    hasUpperCase: (value: string) => /[A-Z]/.test(value) || traduction.password.hasUpperCase,
    hasLowerCase: (value: string) => /[a-z]/.test(value) || traduction.password.hasLowerCase,
    hasNumber: (value: string) => /\d/.test(value) || traduction.password.hasNumber,
    hasSpecialChar: (value: string) => /[!@#$%^&*(),.?":{}|<>_]/.test(value) || traduction.password.hasSpecialChar,
    minLength: (value: string) => /^.{8,}$/.test(value) || traduction.password.minLength
  }

  const validateEmail = {
    hasAt: (value: string) => value.includes('@') || traduction.email.hasAt,
    hasPoint: (value: string) => value.includes('.') || traduction.email.hasPoint
  }

  return { validatePassword, validateEmail }
}

export default useFormValidations
