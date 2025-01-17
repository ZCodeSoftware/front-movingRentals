import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import { useState } from 'react'
import ToursList from './ToursList'
import VehicleList from './VehiclesList'
import TransfersList from './TransfersList'
import TicketsList from './TicketsList'

const DashboardProducts = () => {
  const [view, setView] = useState('vehicles')

  const renderView = () => {
    switch (view) {
      case 'vehicles':
        return <VehicleList />
      case 'tours':
        return <ToursList />
      case 'tickets':
        return <TicketsList />
      case 'transfers':
        return <TransfersList />
      default:
        return null
    }
  }

  return (
    <div>
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
              color={view === 'tickets' ? 'primary' : 'default'}
              variant={view === 'tickets' ? 'solid' : 'light'}
              onClick={() => setView('tickets')}
            >
              Tickets
            </Button>
            <Button
              color={view === 'transfers' ? 'primary' : 'default'}
              variant={view === 'transfers' ? 'solid' : 'light'}
              onClick={() => setView('transfers')}
            >
              Tranfers
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div>{renderView()}</div>
    </div>
  )
}

export default DashboardProducts
