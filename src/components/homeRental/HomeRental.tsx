import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@nextui-org/react'
import { IHomeRentalProps } from './models/home-rental-props.interface'
import { IVehicles } from '../../services/products/models/vehicles.interface'
import { ISelectData } from './models/Select-data'
import CategoriesDropdown from './components/CategoriesDropdown'
import ToursDropdown from './components/ToursDropdown'
import BranchSelector from './components/BranchSelect'
import TravelersDropdown from './components/TravelersDropdown'
import SelectedProductRender from './components/SelectedProductRender'
import TransferSelector from './components/TransferSelect'
import ValidateProductInCart from '../../pages/cart/utils/validateProductInCart'

const HomeRental: React.FC<IHomeRentalProps> = ({ categoriesData }) => {
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, IVehicles[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [selectData, setSelectData] = useState<ISelectData>({
    travelers: { adults: 1, childrens: 0 },
    selectedItem: [],
    selectedTours: [],
    branch: '',
    transfer: []
  })
  const [isSticky, setIsSticky] = useState(false)
  const [isSubmitDisable, setIsSubmitDisable] = useState(false)
  const { t } = useTranslation()

  const handleScroll = () => {
    setIsSticky(window.pageYOffset >= 80)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubmit = async () => {
    if (!selectData.branch && (selectData.selectedItem.length > 0 || selectData.selectedTours.length > 0)) {
      alert('Por favor, selecciona una sucursal.')
      return
    }

    if (
      selectData.selectedItem.length === 0 &&
      selectData.selectedTours.length === 0 &&
      selectData.transfer.length === 0
    ) {
      alert('Por favor, selecciona al menos un vehiculo, tour o traslado.')
      return
    }
    const formattedItems = selectData.selectedItem.map(item => ({
      ...item,
      dates: item.dates
        ? {
            start: item.dates.start ? item.dates.start.toDate().toISOString() : null,
            end: item.dates.end ? item.dates.end.toDate() : null
          }
        : null,
      vehicle: item.vehicle ? item.vehicle._id : null,
      total: item.total
    }))

    const formattedTours = selectData.selectedTours.map(item => ({
      ...item,
      date: item.date ? item.date.toString() : null,
      tour: item.tour ? item.tour._id : null
    }))
    const formattedTransfers = selectData.transfer.map(item => ({
      ...item,
      transfer: item._id ? item._id : null
    }))

    const backPayload = {
      branch: selectData.branch,
      transfer: selectData.transfer,
      travelers: formattedTransfers,
      selectedItems: formattedItems,
      selectedTours: formattedTours
    }

    const localStoragePayload = {
      branch: selectData.branch,
      transfer: selectData.transfer,
      travelers: selectData.travelers,
      selectedItems: selectData.selectedItem,
      selectedTours: selectData.selectedTours
    }
    try {
      if (localStorage.getItem('user')) {
      } else {
        ValidateProductInCart(localStoragePayload)
      }
    } catch (error: any) {}

    console.log('Datos enviados:', backPayload)
    console.log('Datos enviados:', localStoragePayload)
    alert('Datos enviados correctamente')
  }

  return (
    <div
      className={`bg-backgroundWhite border border-[#EEEEEE] rounded-lg w-full mx-auto block md:sticky top-16 z-20 mt-8 transition-all duration-150 ${
        isSticky || selectData.selectedItem.length > 0 || selectData.selectedTours.length > 0
          ? 'md:w-full'
          : 'md:w-11/12'
      }`}
    >
      <div className='flex flex-row w-full md:p-4 gap-4 justify-center items-center border-b border-[#EEEEEE]'>
        <TransferSelector
          onTransferChange={(transfer: any) => {
            setSelectData(prev => ({
              ...prev,
              transfer
            }))
          }}
        />
        <CategoriesDropdown
          categoriesData={categoriesData}
          vehiclesByCategory={vehiclesByCategory}
          loading={loading}
          setVehiclesByCategory={setVehiclesByCategory}
          setLoading={setLoading}
          setSelectData={setSelectData}
          selectData={selectData}
          setIsSubmitDisable={setIsSubmitDisable}
        />
        <ToursDropdown
          loading={loading}
          setLoading={setLoading}
          setSelectData={setSelectData}
          setIsSubmitDisable={setIsSubmitDisable}
          selectData={selectData}
        />
      </div>
      <div className='w-full flex flex-col md:flex-row justify-evenly md:p-6'>
        <div className='flex flex-col items-center'>
          <div className='flex flex-col md:flex-row justify-start gap-12 items-start p-2'>
            <BranchSelector
              branch={selectData.branch}
              onBranchChange={branch => setSelectData(prev => ({ ...prev, branch }))}
              loading={loading}
              setLoading={setLoading}
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
        <div className='flex justify-center h-full'>
          <SelectedProductRender
            products={[...selectData.selectedItem, ...selectData.selectedTours]}
            setSelectData={setSelectData}
            selectData={selectData}
          />
        </div>
        <div className='flex justify-center items-center p-2'>
          <Button className='p-2 bg-buttonPrimary' isDisabled={isSubmitDisable} onPress={handleSubmit}>
            {t('HomeRental.add_to_cart')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HomeRental
