// components/Footer.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'

const Footer: React.FC = () => {
  const { t } = useTranslation()

  return (
    <footer className='bg-gray-800 p-4 mt-auto'>
      <div className='container mx-auto text-center text-gray-300'>{t('footer.footer_copyright')}</div>
    </footer>
  )
}

export default Footer
