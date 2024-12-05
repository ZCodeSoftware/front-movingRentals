import { useState, useEffect } from 'react'
import { Select, SelectItem, Skeleton } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { ITransferSelectProps } from '../models/transfer-select-props'
import { fetchTransfers } from '../../../services/transfers/transfersService'
import { ITransfers } from '../../../services/transfers/models/transfers.interface'

const TransferSelector: React.FC<ITransferSelectProps> = ({ transfer, onTransferChange }) => {
  const { t } = useTranslation()
  const [transfers, setTransfers] = useState<ITransfers[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getData = async () => {
      const result = await fetchTransfers()
      setTransfers(result)
      setLoading(false)
    }

    getData()
  }, [])

  return (
    <Select
      value={transfer._id}
      className='max-w-44'
      style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}
      label={t('HomeRental.transfers.title')}
      onChange={e => {
        const selectedTransfer = transfers.find(t => t._id === e.target.value)
        if (selectedTransfer) {
          onTransferChange(selectedTransfer)
        }
      }}
    >
      {loading ? (
        <SelectItem key='skeleton-1' isDisabled>
          <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
          <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
          <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
        </SelectItem>
      ) : transfers?.length > 0 ? (
        transfers.map(t => <SelectItem key={t._id}>{t.place}</SelectItem>)
      ) : (
        <SelectItem key='no-products' className='text-gray-500 text-center'>
          {t('HomeRental.transfers.no_transfers_available')}
        </SelectItem>
      )}
    </Select>
  )
}

export default TransferSelector
