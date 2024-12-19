import { SetStateAction } from 'react'

export interface IChangePasswordProps {
  onUpdate: () => Promise<void>
  passwordModal: boolean
  setPasswordModal: React.Dispatch<SetStateAction<boolean>>
}
