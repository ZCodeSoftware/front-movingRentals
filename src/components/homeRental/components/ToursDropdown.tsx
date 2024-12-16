import { useState } from 'react'
import { Select, SelectItem, Skeleton } from '@nextui-org/react'
import { fetchAllTours } from '../../../services/products/tours/GET/tours.get.service'
import { ITours } from '../../../services/products/models/tours.interface'
import { IToursDropdownProps } from '../models/tours-dropdown-props.interface'
import { useTranslation } from 'react-i18next'
import { ISelectData } from '../models/Select-data'

const ToursDropdown: React.FC<IToursDropdownProps> = ({ loading, setLoading, setSelectData, selectData }) => {
  const [data, setData] = useState<ITours[]>([])
  const { t } = useTranslation()

  const getData = async () => {
    setLoading(prev => ({ ...prev, tours: true }))
    const result = await fetchAllTours()
    setData(result)
    setLoading(prev => ({ ...prev, tours: false }))
  }

  return (
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden'>
      <Select
        renderValue={() => {
          const count = selectData?.length || 0
          return count > 0 ? `${count} ${t('HomeRental.selected_items')}` : ''
        }}
        data-filled={true}
        data-has-value={true}
        className='md:min-w-44 min-w-28'
        style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}
        selectionMode='multiple'
        label='Tours'
        onOpenChange={async isOpen => {
          if (isOpen) {
            await getData()
          }
        }}
        onSelectionChange={selectedKeys => {
          const selectedIds = Array.from(selectedKeys) as string[]
          const selectedTours = data.filter(tour => selectedIds.includes(tour._id))
          setSelectData((prev: ISelectData) => ({
            ...prev,
            selectedTours
          }))
        }}
      >
        {loading.tours ? (
          <SelectItem key='skeleton-1' isDisabled>
            <Skeleton className='w-full h-2 rounded-lg mb-2'></Skeleton>
            <Skeleton className='w-[80%] h-2 rounded-lg mb-2'></Skeleton>
            <Skeleton className='w-[60%] h-2 rounded-lg'></Skeleton>
          </SelectItem>
        ) : data?.length > 0 ? (
          data.map(t => <SelectItem key={String(t._id)}>{t.name}</SelectItem>)
        ) : (
          <SelectItem key='no-products' className='text-gray-500 text-center'>
            {t('HomeRental.no_products_available')}
          </SelectItem>
        )}
      </Select>
    </div>
  )
}

export default ToursDropdown
