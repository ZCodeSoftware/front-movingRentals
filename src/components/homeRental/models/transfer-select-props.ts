import { ISelectData } from './Select-data'

export interface ITransferSelectProps {
  loading: Record<string, boolean>
  setLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  setSelectData: React.Dispatch<React.SetStateAction<any>>
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>
  selectData: ISelectData
}
