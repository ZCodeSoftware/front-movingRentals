import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'

const ToursDropdown: React.FC = () => {
  return (
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden'>
      <Dropdown closeOnSelect={false} className='w-[200px]'>
        <DropdownTrigger>
          <Button className='w-44 h-14' style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}>
            Tours
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='w-full p-4 bg-white shadow-lg rounded-lg'>
          <DropdownItem className='w-full'>tour1</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default ToursDropdown
