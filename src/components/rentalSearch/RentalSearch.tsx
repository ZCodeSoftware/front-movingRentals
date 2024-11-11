import React, { useState, useEffect } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  DateRangePicker,
  NextUIProvider
} from '@nextui-org/react'
import { getLocalTimeZone, ZonedDateTime, now } from '@internationalized/date'
import { useTranslation } from 'react-i18next'
import { IRentalSearchProps } from './models/rental-search-props.interface'

interface SearchData {
  dates: {
    start: ZonedDateTime
    end: ZonedDateTime
  }
  travelers: { adults: number; childrens: number }
  selectedCategory: { id: string; name: string }
}

const RentalSearch: React.FC<IRentalSearchProps> = ({ categoriesData }) => {
  const [searchData, setSearchData] = useState<SearchData>({
    dates: {
      start: now(getLocalTimeZone()),
      end: now(getLocalTimeZone()).add({ days: 7 })
    },
    travelers: { adults: 1, childrens: 1 },
    selectedCategory: { id: '', name: '' }
  })
  const [isSticky, setIsSticky] = useState(false)
  const { i18n } = useTranslation()

  const handleScroll = () => {
    setIsSticky(window.pageYOffset >= 80)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleCategorySelect = (category: { id: string; name: string }) => {
    setSearchData({ ...searchData, selectedCategory: category })
  }

  const handleIncrement = () => {
    setSearchData({
      ...searchData,
      travelers: {
        ...searchData.travelers,
        adults: searchData.travelers.adults + 1
      }
    })
  }

  const handleDecrement = () => {
    if (searchData.travelers.adults > 1) {
      setSearchData({
        ...searchData,
        travelers: {
          ...searchData.travelers,
          adults: searchData.travelers.adults - 1
        }
      })
    }
  }

  return (
    <div
      className={`bg-white border rounded-lg md:p-6 w-full mx-auto block md:sticky top-16 z-20 mt-8 transition-all duration-150 ${
        isSticky ? 'md:w-full' : 'md:w-11/12'
      }`}
    >
      <div className='max-w-full flex flex-row md:justify-center items-center border p-2 text-center overflow-x-auto md:overflow-hidden'>
        {categoriesData &&
          categoriesData.length > 0 &&
          categoriesData.map(c => (
            <Button
              key={c._id}
              variant={searchData.selectedCategory?.id === c._id ? 'faded' : 'light'}
              className='px-2'
              onClick={() => handleCategorySelect({ id: c._id, name: c.name })}
            >
              {c.name}
            </Button>
          ))}
      </div>
      <div className='flex flex-col md:flex-row justify-evenly items-center p-2'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 place-items-center'>
          <NextUIProvider locale={i18n.language}>
            <DateRangePicker
              hourCycle={24}
              className='w-full p-2'
              hideTimeZone
              value={searchData.dates}
              onChange={e => {
                setSearchData({ ...searchData, dates: e })
              }}
              defaultValue={searchData.dates}
              label='duration'
              calendarProps={{ className: 'uppercase' }}
            />
          </NextUIProvider>
          <div className='w-full h-[80%]'>
            <Dropdown closeOnSelect={false}>
              <DropdownTrigger className='w-full h-full p-2'>
                <Button
                  data-hover={false}
                  variant='light'
                  className='flex flex-col items-start bg-gray-100 hover:bg-gray-200'
                >
                  <h1 className='text-xs'>Travelers</h1>
                  <p>Choose traveler's quantity</p>
                </Button>
              </DropdownTrigger>
              <DropdownMenu className='w-full'>
                <DropdownItem isReadOnly key='travelers-select-item' className='w-full cursor-default'>
                  <div className='flex flex-row justify-between items-center w-full'>
                    <div>Adults</div>
                    <div className='flex items-center border rounded-full mx-2'>
                      <Button onPress={handleDecrement} className='rounded-full border text-xs'>
                        -
                      </Button>
                      <input
                        className='h-6 w-6 text-center text-xs outline-none 
            [&::-webkit-inner-spin-button]:appearance-none 
            [&::-webkit-outer-spin-button]:m-0'
                        type='number'
                        min='1'
                        value={searchData.travelers.adults}
                        readOnly
                      />
                      <Button onPress={handleIncrement} className='rounded-full border text-xs'>
                        +
                      </Button>
                    </div>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className='w-full md:w-24'>
          <Button className='w-full p-2'>Search</Button>
        </div>
      </div>
    </div>
  )
}

export default RentalSearch
