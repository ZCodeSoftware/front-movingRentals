import React from 'react'
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react'
import { PrivacyPolicyEs, CancelationPolicyEs } from '../../../../mocks/PoliciesEs'
import { PrivacyPolicyEn, CancelationPolicyEn } from '../../../../mocks/PoliciesEn'
import { useTranslation } from 'react-i18next'

interface IPolicyModal {
  open: any
  setOpen: any
}

const PolicyModal: React.FC<IPolicyModal> = ({ open, setOpen }) => {
  const { t, i18n } = useTranslation()
  return (
    <div className='w-full'>
      <Modal
        closeButton
        scrollBehavior='inside'
        className='max-w-4xl h-auto'
        isOpen={open}
        onClose={() => setOpen({ ...open, privacy: false, cancelation: false })}
        aria-labelledby='policy-and-terms-modal'
      >
        <ModalContent>
          {open.privacy === true ? (
            <>
              <ModalHeader>
                <h1 id='policy-and-terms-modal'>{t('footer.privacy_policy')}</h1>
              </ModalHeader>
              <ModalBody>
                <h1 className='whitespace-pre-line'>{i18n.language === 'es' ? PrivacyPolicyEs : PrivacyPolicyEn}</h1>
              </ModalBody>
              <ModalFooter>
                <Button onPress={() => setOpen({ ...open, privacy: false, cancelation: false })}>Cerrar</Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>
                <h1 id='policy-and-terms-modal'>{t('footer.cancelation_policy')}</h1>
              </ModalHeader>
              <ModalBody>
                <h1 className='whitespace-pre-line'>
                  {i18n.language === 'es' ? CancelationPolicyEs : CancelationPolicyEn}
                </h1>
              </ModalBody>
              <ModalFooter>
                <Button onPress={() => setOpen({ ...open, privacy: false, cancelation: false })}>Cerrar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default PolicyModal
