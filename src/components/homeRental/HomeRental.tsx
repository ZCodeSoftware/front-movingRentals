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
import { postCart } from '../../services/cart/POST/cart.post.service'
import { IUser } from '../../services/users/models/user.interface'
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service'
import { setLocalStorage } from '../../utils/local-storage/setLocalStorage'
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage'
import { FaShoppingCart } from 'react-icons/fa'

const HomeRental: React.FC<IHomeRentalProps> = ({ categoriesData }) => {
  const [userData, setUserData] = useState<IUser>()
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, IVehicles[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [selectData, setSelectData] = useState<ISelectData>({
    travelers: { adults: 1, childrens: 0 },
    selectedItems: [],
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
    const getData = async () => {
      const result = await fetchUserDetail()
      setUserData(result)
    }
    getData()
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubmit = async () => {
    if (!selectData.branch && (selectData.selectedItems.length > 0 || selectData.selectedTours.length > 0)) {
      alert('Por favor, selecciona una sucursal.')
      return
    }

    if (
      selectData.selectedItems.length === 0 &&
      selectData.selectedTours.length === 0 &&
      selectData.transfer.length === 0
    ) {
      alert('Por favor, selecciona al menos un vehiculo, tour o traslado.')
      return
    }
    const formattedItems = selectData.selectedItems.map(item => ({
      ...item,
      dates: item.dates
        ? {
          start: item.dates.start ? item.dates.start.toDate().toISOString() : null,
          end: item.dates.end ? item.dates.end.toDate().toISOString() : null
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
      date: item.date ? item.date.toDate().toISOString() : null,
      transfer: item.transfer._id ? item.transfer._id : null
    }))

    const localBackCart = getLocalStorage('backCart')

    const combinedVehicle = localBackCart
      ? [
        ...localBackCart.selectedItems,
        ...formattedItems.filter(
          item => !localBackCart.selectedItems.some((localItem: any) => localItem.vehicle === item.vehicle)
        )
      ]
      : null

    const combinedTours = localBackCart
      ? [
        ...localBackCart.selectedTours,
        ...formattedTours.filter(
          item => !localBackCart.selectedTours.some((localItem: any) => localItem.tour === item.tour)
        )
      ]
      : null

    const combinedTransfers = localBackCart
      ? [
        ...localBackCart.transfer,
        ...formattedTransfers.filter(
          item => !localBackCart.transfer.some((localItem: any) => localItem.transfer === item.transfer)
        )
      ]
      : null

    const backPayload = {
      branch: selectData.branch ? selectData.branch : localBackCart.branch,
      transfer: localBackCart ? combinedTransfers : formattedTransfers,
      travelers: selectData.travelers ? selectData.travelers : localBackCart.travelers,
      selectedItems: localBackCart ? combinedVehicle : formattedItems,
      selectedTours: localBackCart ? combinedTours : formattedTours
    }

    const localStoragePayload = {
      branch: selectData.branch,
      transfer: selectData.transfer,
      travelers: selectData.travelers,
      selectedItems: selectData.selectedItems,
      selectedTours: selectData.selectedTours
    }
    try {
      if (localStorage.getItem('user')) {
        if (userData) {
          await postCart({ cart: backPayload as any, userCartId: userData.cart })
          setLocalStorage('backCart', backPayload)
        }
      } else {
        ValidateProductInCart(localStoragePayload)
      }
    } catch (error: any) { }

    alert('Datos enviados correctamente')
  }

  return (
    <div
      className={`bg-backgroundWhite p-0 md:p-2 md:bg-transparent md:backdrop-blur-lg border border-[#eeeeee] rounded-lg w-full shadow-xl mx-auto block md:sticky top-16 z-20 mt-8 transition-all duration-150 ${isSticky || selectData.selectedItems.length > 0 || selectData.selectedTours.length > 0
        ? 'md:w-full'
        : 'md:w-11/12'
        }`}
    >
      <div className='flex flex-col md:flex-row w-full md:p-2 gap-0 md:gap-4 justify-center items-center border-b border-[#EEEEEE]'>
        <div className='w-full md:w-1/3'>
          <TransferSelector
            loading={loading}
            setLoading={setLoading}
            setSelectData={setSelectData}
            setIsSubmitDisable={setIsSubmitDisable}
            selectData={selectData}
          />
        </div>
        <div className='w-full md:w-1/3'>
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
        </div>
        <div className='w-full md:w-1/3'>
          <ToursDropdown
            loading={loading}
            setLoading={setLoading}
            setSelectData={setSelectData}
            setIsSubmitDisable={setIsSubmitDisable}
            selectData={selectData}
          />
        </div>
      </div>
      <div className='w-full flex flex-col md:flex-row justify-evenly md:p-2'>
        <div className='flex flex-col items-center w-full md:w-1/2'>
          <div className='flex flex-col md:flex-row justify-start gap-4 items-start p-2 w-full'>
            <div className='w-full md:w-1/2'>
              <BranchSelector
                branch={selectData.branch}
                onBranchChange={branch => setSelectData(prev => ({ ...prev, branch }))}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
            <div className='w-full md:w-1/2'>
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
        </div>
        <div className='flex flex-col items-center w-full md:w-1/2'>
          <div className='flex justify-center h-full w-full'>
            <SelectedProductRender
              products={[...selectData.selectedItems, ...selectData.selectedTours]}
              setSelectData={setSelectData}
              selectData={selectData}
            />
          </div>
          <div className='flex justify-center items-center p-2 w-full'>
            <Button className='w-full p-2 h-14 bg-buttonPrimary flex justify-center items-center text-sm' isDisabled={isSubmitDisable} onPress={handleSubmit}>
              <FaShoppingCart className='mr-2' />
              {t('HomeRental.add_to_cart')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeRental