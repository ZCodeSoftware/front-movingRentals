import { mockTransfers } from '../../mocks/Transfers'
import { ITransfers } from './models/transfers.interface'

export const fetchTransfers = async (): Promise<ITransfers[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockTransfers)
    }, 1000)
  })
}
