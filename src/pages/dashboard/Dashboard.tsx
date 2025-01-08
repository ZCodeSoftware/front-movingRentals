import React, { useState } from 'react'
import { IDashboardItem } from './models/dashboard-items.interface'
import DashboardHome from './components/dashboardHome/DashboardHome'
import DashboardProducts from './components/dashboardProducts/servicesList/DashboardServicesList'
import DashboardCreateProduct from './components/dashboardProducts/createProduct/DashboardCreateProduct'
import Sidebar from './components/Sidebar'
import DashboardCatalogsList from './components/dashboardCatalogs/catalogsList/DashboardCatalogList'
import DashboardCreateCatalogs from './components/dashboardCatalogs/createCatalogs/DashboardCreate'

const Dashboard: React.FC = () => {
  const dashboardItems: IDashboardItem[] = [
    {
      id: 'home',
      name: 'Inicio',
      component: <DashboardHome />
    },
    {
      id: 'services',
      name: 'Servicios',
      subItems: [
        {
          id: 'service-list',
          name: 'Lista de Servicios',
          component: <DashboardProducts />
        },
        {
          id: 'create-service',
          name: 'Crear Servicio',
          component: <DashboardCreateProduct />
        }
      ]
    },
    {
      id: 'catalogs',
      name: 'Catálogos',
      subItems: [
        {
          id: 'catalog-list',
          name: 'Lista de Catálogos',
          component: <DashboardCatalogsList />
        },
        {
          id: 'create-catalog',
          name: 'Crear Catálogo',
          component: <DashboardCreateCatalogs />
        }
      ]
    }
  ]

  const [activePage, setActivePage] = useState<string>(dashboardItems[0].id)

  const findActiveComponent = (items: IDashboardItem[]): React.ReactNode => {
    for (const item of items) {
      if (item.id === activePage) {
        return item.component
      }

      if (item.subItems) {
        const subItemComponent = item.subItems.find(subItem => subItem.id === activePage)?.component
        if (subItemComponent) {
          return subItemComponent
        }
      }
    }
    return null
  }

  const ActiveComponent = findActiveComponent(dashboardItems)

  return (
    <div className='flex w-full h-screen'>
      <div className='w-64 bg-gray-100 border-r p-4 flex flex-col overflow-y-auto'>
        <div className='mb-10 text-center'>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
        </div>
        <Sidebar dashboardItems={dashboardItems} activePage={activePage} setActivePage={setActivePage} />
        <div className='mt-auto text-center'>
          <p className='text-sm text-gray-500'>© 2024 Mooving</p>
        </div>
      </div>
      <div className='flex-grow bg-white overflow-y-auto p-4'>
        <div>{ActiveComponent}</div>
      </div>
    </div>
  )
}

export default Dashboard
