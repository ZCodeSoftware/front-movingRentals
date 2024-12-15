import { Accordion, AccordionItem, Button } from '@nextui-org/react'
import { ISidebarProps } from '../models/sidebar-props.interface'

const Sidebar = ({ dashboardItems, activePage, setActivePage }: ISidebarProps) => {
  const renderSidebarItems = () => {
    return dashboardItems.map(item => {
      if (item.subItems) {
        return (
          <Accordion key={item.id} variant='light' className='p-0'>
            <AccordionItem
              key={item.id}
              aria-label={item.name}
              title={<div className='flex items-center'>{item.name}</div>}
            >
              <div className='pl-4'>
                {item.subItems.map(subItem => (
                  <Button
                    key={subItem.id}
                    variant={activePage === subItem.id ? 'solid' : 'light'}
                    color={activePage === subItem.id ? 'primary' : 'default'}
                    className='w-full justify-start mb-1'
                    onClick={() => setActivePage(subItem.id)}
                  >
                    {subItem.name}
                  </Button>
                ))}
              </div>
            </AccordionItem>
          </Accordion>
        )
      }
      return (
        <Button
          key={item.id}
          variant={activePage === item.id ? 'solid' : 'light'}
          color={activePage === item.id ? 'primary' : 'default'}
          className='w-full justify-start mb-2'
          onClick={() => setActivePage(item.id)}
        >
          {item.name}
        </Button>
      )
    })
  }
  return <nav className='flex-grow'>{renderSidebarItems()}</nav>
}

export default Sidebar
