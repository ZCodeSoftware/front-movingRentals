// components/Navbar.tsx
import React from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Select,
  SelectItem
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = React.useState(i18n.language)

  const menuItems = [
    'Profile',
    'Dashboard',
    'Activity',
    'Analytics',
    'System',
    'Deployments',
    'My Settings',
    'Team Settings',
    'Help & Feedback',
    'Log Out'
  ]

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    i18n.changeLanguage(value)
  }

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className='sm:hidden' justify='start'>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
      </NavbarContent>

      <NavbarContent className='sm:hidden pr-3' justify='center'>
        <NavbarBrand>
          <p className='font-bold text-inherit'>ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarBrand>
          <p className='font-bold text-inherit'>ACME</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color='foreground' href='#'>
            {t('navBar.features')}
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href='#' aria-current='page'>
            {t('navBar.customers')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            {t('navBar.integrations')}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem className='hidden lg:flex'>
          <Link href='#'>{t('navBar.login')}</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color='warning' href='#' variant='flat'>
            {t('navBar.signup')}
          </Button>
        </NavbarItem>
        <NavbarItem className='w-4/12'>
          <Select
            placeholder={t('navBar.select_language')}
            value={language}
            onChange={e => handleLanguageChange(e.target.value)}
            className='w-full'
          >
            <SelectItem value='en' key={'en'}>
              English
            </SelectItem>
            <SelectItem value='es' key={'es'}>
              Español
            </SelectItem>
          </Select>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className='w-full'
              color={index === 2 ? 'warning' : index === menuItems.length - 1 ? 'danger' : 'foreground'}
              href='#'
              size='lg'
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}
