import { useState } from 'react'
import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import CreateVehicle from './CreateVehicle'
import CreateTour from './CreateTour'
import CreateTransfer from './CreateTransfer'

const DashboardCreateProduct = () => {
  const [view, setView] = useState('vehicles')

  const renderView = () => {
    switch (view) {
      case 'vehicles':
        return <CreateVehicle />
      case 'tours':
        return <CreateTour />
      case 'transfers':
        return <CreateTransfer />
      default:
        return null
    }
  }

  return [
    <div className='w-full'>
      <Navbar isBordered className='w-full flex justify-center z-10'>
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
            <Button
              color={view === 'transfers' ? 'primary' : 'default'}
              variant={view === 'transfers' ? 'solid' : 'light'}
              onClick={() => setView('transfers')}
            >
              Transfers
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div>{renderView()}</div>
    </div>
  ]
}

export default DashboardCreateProduct
