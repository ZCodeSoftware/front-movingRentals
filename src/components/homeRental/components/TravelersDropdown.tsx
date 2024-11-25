import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { ITravelersDropdownProps } from '../models/travelers-dropdown-props'

const TravelersDropdown: React.FC<ITravelersDropdownProps> = ({ travelers, onIncrement, onDecrement }) => {
  const { t } = useTranslation()

  return (
    <div className='flex w-full'>
      <Dropdown closeOnSelect={false} className='w-full h-full p-2'>
        <DropdownTrigger className='w-full h-full p-2'>
          <Button
            data-hover={false}
            variant='light'
            className='flex flex-col items-start bg-gray-100 hover:bg-gray-200 gap-1'
          >
            <h1 className='text-xs m-0'>{t('HomeRental.travelers.title')}</h1>
            <p>{t('HomeRental.travelers.subtitle')}</p>
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='p-2 min-w-full'>
          <DropdownItem isReadOnly key='travelers-select-item' className='cursor-default'>
            <div className='flex flex-row justify-around items-center w-full'>
              <div className='w-2/4'>{t('HomeRental.travelers.adults')}</div>
              <div className='flex items-center border rounded-full'>
                <Button onPress={() => onDecrement('adults')} className='rounded-full border text-xs min-w-10'>
                  -
                </Button>
                <input
                  className='h-6 w-6 text-center text-xs outline-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [&::-webkit-outer-spin-button]:m-0'
                  type='number'
                  min='1'
                  value={travelers.adults}
                  readOnly
                />
                <Button onPress={() => onIncrement('adults')} className='rounded-full border text-xs min-w-10'>
                  +
                </Button>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem isReadOnly key='children-select-item' className='cursor-default'>
            <div className='flex flex-row justify-between items-center w-full gap-6'>
              <div className='w-2/4'>{t('HomeRental.travelers.childrens')}</div>
              <div className='flex items-center border rounded-full'>
                <Button onPress={() => onDecrement('childrens')} className='rounded-full border text-xs min-w-10'>
                  -
                </Button>
                <input
                  className='h-6 w-6 text-center text-xs outline-none 
        [&::-webkit-inner-spin-button]:appearance-none 
        [&::-webkit-outer-spin-button]:m-0'
                  type='number'
                  min='0'
                  value={travelers.childrens}
                  readOnly
                />
                <Button onPress={() => onIncrement('childrens')} className='rounded-full border text-xs min-w-10'>
                  +
                </Button>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default TravelersDropdown