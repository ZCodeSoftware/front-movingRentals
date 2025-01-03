import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Spinner, Accordion, AccordionItem, Skeleton, NextUIProvider, DatePicker } from '@nextui-org/react';
import { today, getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
import { IHomeRentalProps } from './models/home-rental-props.interface';
import { IVehicles } from '../../services/products/models/vehicles.interface';
import { ISelectData } from './models/Select-data';
import CategoriesDropdown from './components/CategoriesDropdown';
import ValidateProductInCart from '../../pages/cart/utils/validateProductInCart';
import { postCart } from '../../services/cart/POST/cart.post.service';
import { IUser } from '../../services/users/models/user.interface';
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service';
import { setLocalStorage } from '../../utils/local-storage/setLocalStorage';
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage';
import { FaShoppingCart } from 'react-icons/fa';
import { fetchTransfers } from '../../services/transfers/GET/transfers.get.service';
import { ITransfers } from '../../services/transfers/models/transfers.interface';
import { fetchAllTours } from '../../services/products/tours/GET/tours.get.service';
import { ITours } from '../../services/products/models/tours.interface';

const HomeRental: React.FC<IHomeRentalProps> = ({ categoriesData }) => {
  const [userData, setUserData] = useState<IUser>();
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, IVehicles[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectData, setSelectData] = useState<ISelectData>({
    travelers: { adults: 1, childrens: 0 },
    selectedItems: [],
    selectedTours: [],
    branch: '',
    transfer: []
  });
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);
  const [selectDate, setSelectDate] = useState<any>(null);
  const [transfers, setTransfers] = useState<ITransfers[]>([]);
  const [tours, setTours] = useState<ITours[]>([]);
  const [selectedTransfer, setSelectedTransfer] = useState<ITransfers | null>(null);
  const [selectedTour, setSelectedTour] = useState<ITours | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<IVehicles | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      const result = await fetchUserDetail();
      setUserData(result);
    };
    getData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('sticky-container');
      const rightSection = document.getElementById('right-section');
      const stickyContent = document.getElementById('sticky-content');
      if (window.scrollY > 30 * 16) { // 30rem in pixels
        element?.classList.add('sticky-reduced');
        rightSection?.classList.add('hidden');
        element?.classList.add('w-full');
        stickyContent?.classList.remove('hidden');
      } else {
        element?.classList.remove('sticky-reduced');
        rightSection?.classList.remove('hidden');
        element?.classList.remove('w-full');
        stickyContent?.classList.add('hidden');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    getTransfersData();
    getToursData();
  }, []);

  const handleSubmit = async () => {
    if (!selectData.branch && (selectData.selectedItems.length > 0 || selectData.selectedTours.length > 0)) {
      alert('Por favor, selecciona una sucursal.');
      return;
    }

    if (
      selectData.selectedItems.length === 0 &&
      selectData.selectedTours.length === 0 &&
      selectData.transfer.length === 0
    ) {
      alert('Por favor, selecciona al menos un vehiculo, tour o traslado.');
      return;
    }
    const formattedItems = selectData.selectedItems.map(item => ({
      ...item,
      dates: item.dates
        ? {
          start: item.dates.start ? item.dates.start.toDate().toISOString() : null,
          end: item.dates.end ? item.dates.end.toDate().toISOString() : null
        }
        : null,
      vehicle: item.vehicle ? item.vehicle._id : null,
      total: item.total
    }));

    const formattedTours = selectData.selectedTours.map(item => ({
      ...item,
      date: item.date ? item.date.toString() : null,
      tour: item.tour ? item.tour._id : null
    }));
    const formattedTransfers = selectData.transfer.map(item => ({
      ...item,
      date: item.date ? item.date.toDate().toISOString() : null,
      transfer: item.transfer._id ? item.transfer._id : null
    }));

    const localBackCart = getLocalStorage('backCart');

    const combinedVehicle = localBackCart
      ? [
        ...localBackCart.selectedItems,
        ...formattedItems.filter(
          item => !localBackCart.selectedItems.some((localItem: any) => localItem.vehicle === item.vehicle)
        )
      ]
      : null;

    const combinedTours = localBackCart
      ? [
        ...localBackCart.selectedTours,
        ...formattedTours.filter(
          item => !localBackCart.selectedTours.some((localItem: any) => localItem.tour === item.tour)
        )
      ]
      : null;

    const combinedTransfers = localBackCart
      ? [
        ...localBackCart.transfer,
        ...formattedTransfers.filter(
          item => !localBackCart.transfer.some((localItem: any) => localItem.transfer === item.transfer)
        )
      ]
      : null;

    const backPayload = {
      branch: selectData.branch ? selectData.branch : localBackCart.branch,
      transfer: localBackCart ? combinedTransfers : formattedTransfers,
      travelers: selectData.travelers ? selectData.travelers : localBackCart.travelers,
      selectedItems: localBackCart ? combinedVehicle : formattedItems,
      selectedTours: localBackCart ? combinedTours : formattedTours
    };

    const localStoragePayload = {
      branch: selectData.branch,
      transfer: selectData.transfer,
      travelers: selectData.travelers,
      selectedItems: selectData.selectedItems,
      selectedTours: selectData.selectedTours
    };
    try {
      if (localStorage.getItem('user')) {
        if (userData) {
          await postCart({ cart: backPayload as any, userCartId: userData.cart });
          setLocalStorage('backCart', backPayload);
        }
      } else {
        ValidateProductInCart(localStoragePayload);
      }
    } catch (error: any) { }

    alert('Datos enviados correctamente');
  };

  const getTransfersData = async () => {
    if (!loading.transfer && transfers.length === 0) {
      setLoading(prev => ({ ...prev, transfers: true }));
      try {
        const result = await fetchTransfers();
        setTransfers(result);
      } catch (error) {
        console.error('Error fetching transfers:', error);
      } finally {
        setLoading(prev => ({ ...prev, transfers: false }));
      }
    }
  };

  const getToursData = async () => {
    if (!loading.tours && tours.length === 0) {
      setLoading(prev => ({ ...prev, tours: true }));
      try {
        const result = await fetchAllTours();
        setTours(result);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(prev => ({ ...prev, tours: false }));
      }
    }
  };

  const isAlreadySelected = (id: string, type: 'transfer' | 'tour') => {
    const localBackCart = getLocalStorage('backCart');
    const localCart = getLocalStorage('cart');
    const isInBackCart = localBackCart?.[type]?.some((item: any) => item[type] === id);
    const isInLocalCart = localCart?.[type]?.some((item: any) => item[type] === id);

    return isInBackCart || isInLocalCart;
  };

  const handleSave = (item: ITransfers | ITours, type: 'transfer' | 'tour') => {
    if (selectDate) {
      setSelectData((prev: ISelectData) => {
        const existingItemIndex = prev[type].findIndex((i: any) => i[type]._id === item._id);

        const newItem = {
          date: selectDate,
          [type]: item
        };

        if (existingItemIndex > -1) {
          const updatedItems = [...prev[type]];
          updatedItems[existingItemIndex] = newItem;
          return {
            ...prev,
            [type]: updatedItems
          };
        }

        return {
          ...prev,
          [type]: [...prev[type], newItem]
        };
      });
    }
  };

  const handleRemove = (item: ITransfers | ITours, type: 'transfer' | 'tour') => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      [type]: prev[type].filter((i: any) => i[type]._id !== item._id)
    }));
  };

  return (
    <div className='flex flex-col md:flex-row w-full bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg'>
      <div id='sticky-container' className='w-full md:w-1/4 p-4 sticky top-0 z-50 transition-all duration-500'>
        <Accordion >
          <AccordionItem key='1' aria-label='Traslados' title={t('HomeRental.transfers.title')}>
            <div className='w-full h-[30rem] overflow-auto p-4'>
              {loading.transfer ? (
                <Skeleton className='w-full h-6 rounded-lg mb-2' />
              ) : transfers?.length > 0 ? (
                transfers.map(transfer => (
                  <div key={transfer._id} className='w-full flex flex-col justify-center items-center'>
                    <Button
                      className='w-full m-2'
                      onPress={() => setSelectedTransfer(transfer)}
                    >
                      {transfer.name}
                    </Button>
                    <div>
                      {isAlreadySelected(transfer._id, 'transfer') ? (
                        <Button className='h-full ml-2 flex items-center justify-center text-wrap' isDisabled>
                          En el carrito
                        </Button>
                      ) : (
                        <>
                          {selectData.transfer.some(s => s.transfer._id === transfer._id) ? (
                            <Button
                              className='h-full ml-2 flex items-center justify-center'
                              onPress={() => handleRemove(transfer, 'transfer')}
                              color='danger'
                              variant='flat'
                            >
                              Eliminar
                            </Button>
                          ) : (
                            <Button
                              className='h-full ml-2 flex items-center justify-center'
                              onPress={() => handleSave(transfer, 'transfer')}
                            >
                              Agregar
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</div>
              )}
            </div>
          </AccordionItem>
          <AccordionItem key='2' aria-label='Vehículos' title={t('HomeRental.vehicles')}>
            <CategoriesDropdown categoriesData={categoriesData} vehiclesByCategory={vehiclesByCategory} loading={loading} setVehiclesByCategory={setVehiclesByCategory} setLoading={setLoading} setSelectData={setSelectData} selectData={selectData} setIsSubmitDisable={setIsSubmitDisable} />
          </AccordionItem>
          <AccordionItem key='3' aria-label='Tours/Tickets' title='Tours | Tickets'>
            <div className='w-full h-[30rem] overflow-auto p-4'>
              {loading.tours ? (
                <Skeleton className='w-full h-6 rounded-lg mb-2' />
              ) : tours?.length > 0 ? (
                tours.map(tour => (
                  <div key={tour._id} className='w-full flex flex-col justify-center items-center'>
                    <Button
                      className='w-full m-2'
                      onPress={() => setSelectedTour(tour)}
                    >
                      {tour.name}
                    </Button>
                    <div>
                      {isAlreadySelected(tour._id, 'tour') ? (
                        <Button className='h-full ml-2 flex items-center justify-center text-wrap' isDisabled>
                          En el carrito
                        </Button>
                      ) : (
                        <>
                          {selectData.selectedTours.some(s => s.tour._id === tour._id) ? (
                            <Button
                              className='h-full ml-2 flex items-center justify-center'
                              onPress={() => handleRemove(tour, 'tour')}
                              color='danger'
                              variant='flat'
                            >
                              Eliminar
                            </Button>
                          ) : (
                            <Button
                              className='h-full ml-2 flex items-center justify-center'
                              onPress={() => handleSave(tour, 'tour')}
                            >
                              Agregar
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</div>
              )}
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      {(selectedTransfer || selectedTour || selectedVehicle) && (
        <div id='right-section' className='w-full md:w-3/4 p-4 transition-all duration-500'>
          <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='col-span-1'>
              <img src='https://res.cloudinary.com/dxn97o78r/image/upload/v1734914271/jmkcls0uge7hiepr322a.png' alt='Placeholder' className='w-16 h-auto rounded-lg mt-4' />
            </div>
            <div className='col-span-1'>
              <NextUIProvider className='w-full flex justify-center mt-3' locale={i18n.language}>
                <DatePicker
                  className='w-full'
                  classNames={{
                    inputWrapper: 'bg-[#D4EDFF] hover:bg-[#D4EDFF] hover:focus-within:bg-[#D4EDFF]'
                  }}
                  onChange={e => setSelectDate(e)}
                  validate={(value: any) => {
                    if (value && value.day < today(getLocalTimeZone()).day) {
                      setIsSubmitDisable(true);
                      return t('HomeRental.date_picker.previous_day_valid');
                    } else {
                      setIsSubmitDisable(false);
                    }
                    return true;
                  }}
                  defaultValue={selectDate}
                  label='Fecha'
                  calendarProps={{ className: 'uppercase' }}
                />
              </NextUIProvider>
              <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg mt-4'>
                <p>Precio por hora: $35</p>
                <p>Precio por 4 horas: $129</p>
                <p>Precio por 8 horas: $129</p>
                <p>Precio por 24 horas: $199</p>
                <p>Capacidad: 1</p>
              </div>
              <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg mt-4'>
                <p className='mt-2'>Esta es una bicicleta de alta calidad, perfecta para paseos largos y cortos. Cuenta con un marco ligero, frenos de disco y una transmisión de 21 velocidades. Ideal para todo tipo de terrenos.</p>
              </div>
            </div>
            <div className='col-span-2'>
              <Button className='w-full p-2 h-14 bg-buttonPrimary flex justify-center items-center text-sm font-semibold mt-4' isDisabled={isSubmitDisable} onPress={handleSubmit}>
                {isSubmitDisable ? (
                  <Spinner color='primary' size='sm' />
                ) : (
                  <>
                    <FaShoppingCart className='mr-2' />
                    {t('HomeRental.add_to_cart')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeRental;