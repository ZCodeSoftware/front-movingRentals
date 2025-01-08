import { Navbar, NavbarContent, NavbarItem, Button } from '@nextui-org/react'
import { useState } from 'react'
import CreateCategory from './createCategory'
import CreateModel from './createModel'
import CreateOwner from './createOwner'

const DashboardCreateCatalogs = () => {
  const [view, setView] = useState('categories')

  const renderView = () => {
    switch (view) {
      case 'categories':
        return <CreateCategory />
      case 'models':
        return <CreateModel />
      case 'owner':
        return <CreateOwner />
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
              color={view === 'categories' ? 'primary' : 'default'}
              variant={view === 'categories' ? 'solid' : 'light'}
              onClick={() => setView('categories')}
            >
              Categorías
            </Button>
            <Button
              color={view === 'models' ? 'primary' : 'default'}
              variant={view === 'models' ? 'solid' : 'light'}
              onClick={() => setView('models')}
            >
              Modelos
            </Button>
            <Button
              color={view === 'owner' ? 'primary' : 'default'}
              variant={view === 'owner' ? 'solid' : 'light'}
              onClick={() => setView('owner')}
            >
              Dueños
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <div>{renderView()}</div>
    </div>
  )
}

export default DashboardCreateCatalogs
