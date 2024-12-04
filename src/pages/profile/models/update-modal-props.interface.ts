interface IUserUpdateData {
  name?: string
  lastName?: string
  email?: string
  cellphone?: string
}

export interface IUpdateFieldModalProps {
  onUpdate: () => Promise<void>
  updateType: keyof IUserUpdateData
  currentValue: string
  label: string
  placeholder: string
}
