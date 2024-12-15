import { useState } from 'react'
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import CreateVehicle from './CreateVehicle'
import CreateTour from './CreateTour'

const DashboardCreateProduct = () => {
  const [view, setView] = useState('vehicles')

  return [
    <div className='w-full'>
      <Navbar isBordered className='w-full flex justify-center'>
        <NavbarContent>
          <NavbarItem className='w-full flex justify-evenly'>
            <Button
              color={view === 'vehicles' ? 'primary' : 'default'}
              variant={view === 'vehicles' ? 'solid' : 'light'}
              onClick={() => setView('vehicles')}
            >
              Vehículos
            </Button>
            <Button
              color={view === 'tours' ? 'primary' : 'default'}
              variant={view === 'tours' ? 'solid' : 'light'}
              onClick={() => setView('tours')}
            >
              Tours
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {view === 'vehicles' ? (
        <div className='p-12'>
          <CreateVehicle />
        </div>
      ) : (
        <div className='p-12'>
          <CreateTour />
        </div>
      )}
    </div>
  ]
}

export default DashboardCreateProduct
