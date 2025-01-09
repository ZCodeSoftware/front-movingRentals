import { useState, useEffect } from 'react'
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
  SelectItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { FaHome, FaShoppingCart, FaUser } from 'react-icons/fa'
import cartIcon from '../../assets/SVG/cart-icon.svg'
import flagUse from '../../assets/SVG/flag-usa.svg'
import logo from '../../assets/SVG/logo.svg'
import flagMex from '../../assets/SVG/flag-mexico.svg'
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service'
import { fetchCart } from '../../services/cart/GET/cart.get.service'
import { IUser } from '../../services/users/models/user.interface'
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage'
import { removeLocalStorage } from '../../utils/local-storage/removeLocalStorage'
import { fetchAllRoles } from '../../services/roles/GET/roles.get.service'
import { IRoles } from '../../services/roles/models/roles.interface'
import { getExchange } from '../../services/exchange/GET/exchange.get.service'

export default function NavbarComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<IUser | null>(null)
  const [cartData, setCartData] = useState<any>(null)
  const [exchangeData, setExchangeData] = useState<any>(null)
  const [roles, setRoles] = useState<IRoles[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      const userResponse = await fetchUserDetail()
      if (userResponse) {
        setIsLoggedIn(true)
        setUserData(userResponse)
      }
    }
    const fetchExchange = async () => {
      const exchangeData = await getExchange()
      if (exchangeData) {
        setExchangeData(exchangeData.conversionRate)
      }
    }

    fetchUserData()
    fetchExchange()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserAndCart()
    }
  }, [isLoggedIn])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await fetchAllRoles()
        setRoles(rolesData)
      } catch (error) {
        console.error('Error fetching roles:', error)
      }
    }

    fetchRoles()
  }, [])

  const fetchUserAndCart = async () => {
    try {
      const userResponse = await fetchUserDetail()
      setUserData(userResponse)

      if (userResponse && userResponse.cart) {
        const cartResponse = await fetchCart(userResponse.cart)
        setCartData(cartResponse)
      }
    } catch (error: any) {
      const localCartData = getLocalStorage('cart')
      if (localCartData) {
        setCartData(localCartData)
      }
      throw new Error(error)
    } finally {
    }
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    i18n.changeLanguage(value)
  }

  const handleLogout = () => {
    removeLocalStorage('user')
    removeLocalStorage('cart')
    setIsLoggedIn(false)
    setUserData(null)
    setCartData(null)
    window.location.href = '/login'
  }

  const adminRole = roles.find(role => role.name === 'ADMIN')

  const itemsInCart =
    (cartData?.vehicles?.length || 0) + (cartData?.tours?.length || 0) + (cartData?.transfer?.length || 0)

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

        <NavbarContent justify='start' className='hidden sm:flex'>
          <NavbarItem className='w-1/2'>
            <Select
              placeholder={t('navBar.select_language')}
              isVirtualized
              value={language}
              onChange={e => handleLanguageChange(e.target.value)}
              className='w-full'
              aria-label={t('navBar.select_language')}
            >
              <SelectItem value='en' key={'en'} textValue={t('navBar.option1')}>
                <div className='flex mx-auto'>
                  <img src={flagUse} />
                  <span className='ml-2'>En</span>
                </div>
              </SelectItem>
              <SelectItem value='es' key={'es'} textValue={t('navBar.option2')}>
                <div className='flex mx-auto'>
                  <img src={flagMex} />
                  <span className='ml-2'>Es</span>
                </div>
              </SelectItem>
            </Select>
          </NavbarItem>
          {isLoggedIn ? (
            <NavbarContent as='div' justify='end' className='flex items-center'>
              <Link href='/cart' className='flex flex-col items-center text-white mr-4 relative'>
                <img src={cartIcon} alt='cart' className='w-8 h-8' />
                {itemsInCart > 0 && (
                  <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'>
                    {itemsInCart}
                  </div>
                )}
              </Link>
              {userData?.role._id === adminRole?._id && (
                <Link href='/dashboard' className='flex flex-col items-center text-white mr-4'>
                  <Button className='bg-buttonPrimary'>Dashboard</Button>
                </Link>
              )}
              <Dropdown placement='bottom-end'>
                <DropdownTrigger>
                  <button className='transition-transform p-2'>
                    <FaUser className='text-3xl text-[#226491] border-2 border-[#45a5e9] rounded-full p-0.5' />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Profile Actions' variant='flat'>
                  <DropdownItem key='profile' className='h-14 gap-2' textValue={t('navBar.signedInAs')}>
                    <p className='font-semibold'>{t('navBar.signedInAs')}</p>
                    <p className='font-semibold'>{userData?.email}</p>
                  </DropdownItem>
                  <DropdownItem key='my_profile' textValue={t('navBar.myProfile')}>
                    <Link href='/profile' className='w-full'>
                      {t('navBar.myProfile')}
                    </Link>
                  </DropdownItem>
                  <DropdownItem key='logout' color='danger' onPress={handleLogout} textValue={t('navBar.logout')}>
                    {t('navBar.logout')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarContent>
          ) : (
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
          )}
          <NavbarItem className='w-12 ml-4'>
            <span>USD $1/MXN ${exchangeData?.toFixed(2)}</span>
          </NavbarItem>
        </NavbarContent>
        <NavbarItem>
          <Link href='/cart' className='flex flex-col items-center text-white mr-4 relative'>
            {/* <img src={cartIcon} alt='cart' className='w-8 h-8' /> */}
            {itemsInCart > 0 && (
              <div className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs transform translate-x-1/2 -translate-y-1/2'>
                {itemsInCart}
              </div>
            )}
          </Link>
        </NavbarItem>
        <NavbarMenu>
          {[
            'Profile',
            'Log Out'
          ].map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className='w-full'
                color={index === 2 ? 'warning' : index === 9 ? 'danger' : 'foreground'}
                href='#'
                size='lg'
              >
                {t(`navBar.${item.toLowerCase().replace(/ /g, '_')}`)}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      <div className='fixed bottom-0 left-0 right-0 bg-[#D4EDFF] shadow-lg sm:hidden z-50'>
        <div className='flex justify-around py-2'>
          <Link href='/' className='flex flex-col items-center text-gray-700'>
            <FaHome className='text-xl' />
            <span className='text-xs'>{t('navBar.home')}</span>
          </Link>
          <Link href='/cart' className='flex flex-col items-center text-gray-700'>
            <FaShoppingCart className='text-xl' />
            <span className='text-xs'>{t('navBar.cart')}</span>
          </Link>
          {isLoggedIn ? (
            <>
              {userData?.role._id === adminRole?._id && (
                <Link href='/dashboard' className='flex flex-col items-center text-gray-700'>
                  <FaUser className='text-xl' />
                  <span className='text-xs'>Dashboard</span>
                </Link>
              )}
              <Link href='/profile' className='flex flex-col items-center text-gray-700'>
                <FaUser className='text-xl' />
                <span className='text-xs'>{t('navBar.profile')}</span>
              </Link>
            </>
          ) : (
            <>
              <Link href='/login' className='flex flex-col items-center text-gray-700'>
                <FaUser className='text-xl' />
                <span className='text-xs'>{t('navBar.login')}</span>
              </Link>
              <Link href='/signin' className='flex flex-col items-center text-gray-700'>
                <FaUser className='text-xl' />
                <span className='text-xs'>{t('navBar.signup')}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}