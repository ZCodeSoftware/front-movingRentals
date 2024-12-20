// components/Navbar.tsx
import React from 'react'
import {
  Navbar,
  NavbarBrand,
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
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa'
import cartIcon from '../../assets/SVG/cart-icon.svg'
import flagUse from '../../assets/SVG/flag-usa.svg'
import logo from '../../assets/SVG/logo.svg'
import flagMex from '../../assets/SVG/flag-mexico.svg'

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
    <>
      <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} className='hidden sm:flex'>
        <NavbarContent className='hidden sm:flex gap-4' justify='center'>
          <NavbarBrand>
            <Link color='foreground' href='/'>
              <img src={logo} alt='Logo' />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify='end' className='hidden sm:flex'>
          <NavbarItem>
            <Link href='/cart' className='flex flex-col items-center text-white'>
              <img src={cartIcon} alt='cart' className='w-8 h-8' />
            </Link>
          </NavbarItem>
          <NavbarItem className='w-1/6'>
            <Select
              placeholder={t('navBar.select_language')}
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
              className='w-full'
            >
              <SelectItem value='en' key={'en'}>
                <div className='flex mx-auto'>
                  <img src={flagUse} />
                  <span className='ml-2'>En</span>
                </div>
              </SelectItem>
              <SelectItem value='es' key={'es'}>
                <div className='flex mx-auto'>
                  <img src={flagMex} />
                  <span className='ml-2'>Es</span>
                </div>
              </SelectItem>
            </Select>
          </NavbarItem>
          <>
            <NavbarItem className='hidden lg:flex mx-4'>
              <Link href='/login' className='border border-buttonPrimary px-8 py-2 rounded-lg'>
                {t('navBar.login')}
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                color='warning'
                href='/signin'
                variant='flat'
                className='bg-buttonPrimary px-8 py-2 rounded-lg'
              >
                {t('navBar.signup')}
              </Button>
            </NavbarItem>
          </>
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

      <div className='fixed bottom-0 left-0 right-0 bg-warning-500 shadow-lg sm:hidden z-50'>
        <div className='flex justify-around py-2'>
          <Link href='/' className='flex flex-col items-center text-white'>
            <FaHome className='text-xl' />
            <span className='text-xs'>{t('navBar.home')}</span>
          </Link>
          <Link href='/cart' className='flex flex-col items-center text-white'>
            <FaShoppingCart className='text-xl' />
            <span className='text-xs'>{t('navBar.cart')}</span>
          </Link>
          <Link href='/profile' className='flex flex-col items-center text-white'>
            <FaUser className='text-xl' />
            <span className='text-xs'>{t('navBar.profile')}</span>
          </Link>
        </div>
      </div>
    </>
  )
}
