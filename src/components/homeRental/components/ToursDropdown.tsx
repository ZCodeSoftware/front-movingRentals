import { useState } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Skeleton,
  DatePicker,
  NextUIProvider,
  DateValue
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { fetchAllTours } from '../../../services/products/tours/GET/tours.get.service'
import { IToursDropdownProps } from '../models/tours-dropdown-props.interface'
import { ITours } from '../../../services/products/models/tours.interface'
import { ISelectData } from '../models/Select-data'
import { getLocalTimeZone, today } from '@internationalized/date'
import i18n from '../../../utils/i18n'
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage'

const ToursDropdown: React.FC<IToursDropdownProps> = ({
  loading,
  setLoading,
  setSelectData,
  setIsSubmitDisable,
  selectData
}) => {
  const { t } = useTranslation()
  const [data, setData] = useState<ITours[]>([])
  const [openPickers, setOpenPickers] = useState(new Set())
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectDate, setSelectDate] = useState<DateValue>(today(getLocalTimeZone()))
  const localBackCart = getLocalStorage('backCart')
  const localCart = getLocalStorage('cart')

  const getData = async () => {
    if (!loading.tours && data.length === 0) {
      setLoading(prev => ({ ...prev, tours: true }))
      try {
        const result = await fetchAllTours()
        setData(result)
      } catch (error) {
        console.error('Error fetching tours:', error)
      } finally {
        setLoading(prev => ({ ...prev, tours: false }))
      }
    }
  }

  const isAlreadySelected = (tourId: string) => {
    const isInBackCart = localBackCart?.selectedTours.some((item: any) => item.tour === tourId)
    const isInLocalCart = localCart?.selectedTours.some((item: any) => item.tour === tourId)

    return isInBackCart || isInLocalCart
  }

  const handleDropdownOpenChange = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen)
    if (isOpen) {
      getData()
    }
  }

  const handleSave = (tour: ITours) => {
    if (selectDate) {
      setSelectData((prev: ISelectData) => {
        const existingItemIndex = prev.selectedTours.findIndex(item => item.tour._id === tour._id)

        const newItem = {
          date: selectDate,
          tour: tour
        }

        if (existingItemIndex > -1) {
          const updatedSelectedTour = [...prev.selectedTours]
          updatedSelectedTour[existingItemIndex] = newItem
          return {
            ...prev,
            selectedTours: updatedSelectedTour
          }
        }

        return {
          ...prev,
          selectedTours: [...prev.selectedTours, newItem]
        }
      })
    }
  }

  const handleRemove = (tour: ITours) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedTours: prev.selectedTours.filter(item => item.tour._id !== tour._id)
    }))
  }

  return (
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden'>
      <Dropdown
        closeOnSelect={false}
        className='max-w-full md:w-[500px]'
        isOpen={isDropdownOpen}
        onOpenChange={handleDropdownOpenChange}
      >
        <DropdownTrigger>
          <Button className='md:min-w-44 mmax-w-28 h-14' style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}>
            Tours
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='w-full p-4 bg-white shadow-lg rounded-lg'>
          {loading.tours ? (
            <DropdownItem isReadOnly>
              <div className='w-full'>
                <Skeleton className='w-full h-6 rounded-lg mb-2' />
                <Skeleton className='w-[80%] h-6 rounded-lg mb-2' />
                <Skeleton className='w-[60%] h-6 rounded-lg' />
              </div>
            </DropdownItem>
          ) : data?.length > 0 ? (
            data.map(tour => (
              <DropdownItem key={tour._id} className='w-full' isReadOnly>
                <div className='w-full flex flex-col justify-center items-center'>
                  <Button
                    className='w-full m-2'
                    onPress={() =>
                      setOpenPickers(prev =>
                        prev.has(tour._id)
                          ? new Set([...prev].filter(id => id !== tour._id))
                          : new Set(prev).add(tour._id)
                      )
                    }
                  >
                    {tour.name}
                  </Button>
                  {openPickers.has(tour._id) && (
                    <div className='w-full h-full flex justify-center'>
                      <NextUIProvider className='w-full flex justify-center' locale={i18n.language}>
                        <DatePicker
                          className='w-full'
                          classNames={{
                            inputWrapper: 'bg-[#D4EDFF] hover:bg-[#D4EDFF] hover:focus-within:bg-[#D4EDFF]'
                          }}
                          onChange={e => setSelectDate(e)}
                          validate={(value: any) => {
                            if (value.day < today(getLocalTimeZone()).day) {
                              setIsSubmitDisable(true)
                              return t('HomeRental.date_picker.previous_day_valid')
                            } else {
                              setIsSubmitDisable(false)
                            }
                            return true
                          }}
                          defaultValue={selectDate}
                          label='Fecha'
                          calendarProps={{ className: 'uppercase' }}
                        />
                      </NextUIProvider>
                      <div>
                        {isAlreadySelected(tour._id) ? (
                          <Button className='h-full ml-2 flex items-center justify-center text-wrap' isDisabled>
                            En el carrito
                          </Button>
                        ) : (
                          <>
                            {selectData.selectedTours.some(s => s.tour._id === tour._id) ? (
                              <Button
                                className='h-full ml-2 flex items-center justify-center'
                                onPress={() => handleRemove(tour)}
                                color='danger'
                                variant='flat'
                              >
                                Eliminar
                              </Button>
                            ) : (
                              <Button
                                className='h-full ml-2 flex items-center justify-center'
                                onPress={() => handleSave(tour)}
                              >
                                Agregar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DropdownItem>
            ))
          ) : (
            <DropdownItem className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default ToursDropdown
