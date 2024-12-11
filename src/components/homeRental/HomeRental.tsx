import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getLocalTimeZone, now } from '@internationalized/date'
import { Button } from '@nextui-org/react'
import { IHomeRentalProps } from './models/home-rental-props.interface'
import { IVehicles } from '../../services/products/models/vehicles.interface'
import { ISelectData } from './models/Select-data'
import CategoriesDropdown from './components/CategoriesDropdown'
import ToursDropdown from './components/ToursDropdown'
import BranchSelector from './components/BranchSelect'
import DatePickerSection from './components/DatePicker'
import TravelersDropdown from './components/TravelersDropdown'
import SelectedProductRender from './components/SelectedProductRender'
import TransferSelector from './components/TransferSelect'

const HomeRental: React.FC<IHomeRentalProps> = ({ categoriesData }) => {
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, IVehicles[]>>({})
  const [selectedItemsByCategory, setSelectedItemsByCategory] = useState<Record<string, Set<string>>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [selectData, setSelectData] = useState<ISelectData>({
    dates: {
      start: now(getLocalTimeZone()),
      end: now(getLocalTimeZone()).add({ hours: 4 })
    },
    travelers: { adults: 1, childrens: 0 },
    selectedItem: [],
    selectedTours: [],
    branch: '',
    transfer: { _id: '', place: '' }
  })
  const [isSticky, setIsSticky] = useState(false)
  const [isSubmitDisable, setIsSubmitDisable] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const currentDate = now(getLocalTimeZone())

    if (currentDate.hour > 20) {
      const start = currentDate.add({ days: 1 })
      const end = currentDate.add({ hours: 4 })

      setSelectData({
        ...selectData,
        dates: { start, end }
      })
    }
  }, [])

  const handleScroll = () => {
    setIsSticky(window.pageYOffset >= 80)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div
      className={`bg-backgroundWhite border border-[#EEEEEE] rounded-lg w-full mx-auto block md:sticky top-16 z-20 mt-8 transition-all duration-150 ${
        isSticky || selectData.selectedItem.length > 0 || selectData.selectedTours.length > 0
          ? 'md:w-full'
          : 'md:w-11/12'
      }`}
    >
      <div className='flex flex-col md:flex-row w-full md:p-4 gap-4 justify-center items-center border-b border-[#EEEEEE]'>
        <TransferSelector
          transfer={selectData.transfer}
          onTransferChange={transfer => {
            setSelectData(prev => ({
              ...prev,
              transfer
            }))
          }}
        />
        <CategoriesDropdown
          categoriesData={categoriesData}
          vehiclesByCategory={vehiclesByCategory}
          selectedItemsByCategory={selectedItemsByCategory}
          loading={loading}
          setVehiclesByCategory={setVehiclesByCategory}
          setSelectedItemsByCategory={setSelectedItemsByCategory}
          setLoading={setLoading}
          setSelectData={setSelectData}
        />
        <ToursDropdown
          loading={loading}
          setLoading={setLoading}
          setSelectData={setSelectData}
          selectData={selectData.selectedTours}
        />
      </div>
      <div className='w-full flex flex-col md:flex-row justify-evenly md:p-6'>
        <div className='flex flex-col items-center'>
          <div className='flex flex-col md:flex-row justify-start gap-4 items-start p-2'>
            <BranchSelector
              branch={selectData.branch}
              onBranchChange={branch => setSelectData(prev => ({ ...prev, branch }))}
              loading={loading}
              setLoading={setLoading}
            />
            <DatePickerSection
              selectData={selectData}
              setSelectData={setSelectData}
              setIsSubmitDisable={setIsSubmitDisable}
            />
            <TravelersDropdown
              travelers={selectData.travelers}
              onIncrement={type => {
                setSelectData(prev => ({
                  ...prev,
                  travelers: {
                    ...prev.travelers,
                    [type]: prev.travelers[type] + 1
                  }
                }))
              }}
              onDecrement={type => {
                setSelectData(prev => ({
                  ...prev,
                  travelers: {
                    ...prev.travelers,
                    [type]: Math.max(0, prev.travelers[type] - 1)
                  }
                }))
              }}
            />
          </div>
        </div>
        <div className='flex h-full'>
          <SelectedProductRender products={[...selectData.selectedItem, ...selectData.selectedTours]} />
        </div>
        <div className='flex justify-center items-center p-2'>
          <Button className='p-2 bg-buttonPrimary' isDisabled={isSubmitDisable}>
            {t('HomeRental.add_to_cart')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomeRental
