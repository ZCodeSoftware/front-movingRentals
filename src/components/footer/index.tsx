// components/Footer.tsx

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PolicyModal from './components/policyInfoModal/PolicyInfoModal'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const [openPoliciesModal, setOpenPoliciesModal] = useState({
    privacy: false,
    cancelation: false
  })

  return (
    <footer className='bg-gray-800 p-4 mt-auto'>
      <div className='flex flex-col text-gray-300 text-sm w-40 space-y-1'>
        <span className='cursor-pointer' onClick={() => setOpenPoliciesModal({ ...openPoliciesModal, privacy: true })}>
          {t('footer.privacy_policy')}
        </span>
        <span
          className='cursor-pointer'
          onClick={() => setOpenPoliciesModal({ ...openPoliciesModal, cancelation: true })}
        >
          {t('footer.cancelation_policy')}
        </span>
      </div>
      <div className='container mx-auto text-center text-gray-300'>{t('footer.footer_copyright')}</div>
      {(openPoliciesModal.cancelation || openPoliciesModal.privacy) && (
        <PolicyModal open={openPoliciesModal} setOpen={setOpenPoliciesModal} />
      )}
    </footer>
  )
}

export default Footer
