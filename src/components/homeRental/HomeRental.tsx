import { useState, useEffect } from 'react';
import { Accordion, AccordionItem, DatePicker } from '@nextui-org/react';
import { IHomeRentalProps } from './models/home-rental-props.interface';
import { IVehicles } from '../../services/products/models/vehicles.interface';
import { ISelectData } from './models/Select-data';
import ValidateProductInCart from '../../pages/cart/utils/validateProductInCart';
import { postCart } from '../../services/cart/POST/cart.post.service';
import { IUser } from '../../services/users/models/user.interface';
import { fetchUserDetail } from '../../services/users/GET/user-detail.get.service';
import { setLocalStorage } from '../../utils/local-storage/setLocalStorage';
import { getLocalStorage } from '../../utils/local-storage/getLocalStorage';
import { fetchTransfers } from '../../services/transfers/GET/transfers.get.service';
import { ITransfers } from '../../services/transfers/models/transfers.interface';
import { fetchAllTours } from '../../services/products/tours/GET/tours.get.service';
import { ITours } from '../../services/products/models/tours.interface';
import ToursAccordionItem from './components/ToursAccordionItem';
import TransfersAccordionItem from './components/TransfersAccordionItem';
import VehiclesAccordionItem from './components/VehiclesAccordionItem';
import SelectedItemDetails from './components/SelectedItemDetails';
import { now, getLocalTimeZone } from '@internationalized/date';

const HomeRental: React.FC<IHomeRentalProps> = ({ categoriesData }) => {
  const [userData, setUserData] = useState<IUser>();
  const [vehiclesByCategory, setVehiclesByCategory] = useState<Record<string, IVehicles[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectData, setSelectData] = useState<ISelectData>({
    travelers: { adults: 1, childrens: 0 },
    selectedItems: [],
    selectedTours: [],
    branch: '',
    transfer: [],
    selectedTransfers: [],
    selectedVehicles: [],
    selectDate: now(getLocalTimeZone())
  });
  const [tours, setTours] = useState<ITours[]>([]);
  const [isSubmitDisable, setIsSubmitDisable] = useState(false);
  const [transfers, setTransfers] = useState<ITransfers[]>([]);

  useEffect(() => {
    console.log('selectedVehicles updated:', selectData.selectedVehicles);
  }, [selectData.selectedVehicles]);

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
        console.log('selectData:', selectData);
      
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
          date: item.date instanceof Date ? item.date.toISOString() : null,
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
          : formattedItems;
      
        const combinedTours = localBackCart
          ? [
            ...localBackCart.selectedTours,
            ...formattedTours.filter(
              item => !localBackCart.selectedTours.some((localItem: any) => localItem.tour === item.tour)
            )
          ]
          : formattedTours;
      
        const combinedTransfers = localBackCart
          ? [
            ...localBackCart.transfer,
            ...formattedTransfers.filter(
              item => !localBackCart.transfer.some((localItem: any) => localItem.transfer === item.transfer)
            )
          ]
          : formattedTransfers;
      
        const backPayload = {
          transfer: combinedTransfers,
          travelers: selectData.travelers,
          selectedItems: combinedVehicle,
          selectedTours: combinedTours
        };
      
        const localStoragePayload = {
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
            setLocalStorage('backCart', localStoragePayload);
          }
        } catch (error: any) {
          console.error('Error al enviar los datos:', error);
        }
      
        // Limpiar los datos de SelectedItemDetails
        setSelectData({
          travelers: { adults: 1, childrens: 0 },
          selectedItems: [],
          selectedTours: [],
          branch: '',
          transfer: [],
          selectedTransfers: [],
          selectedVehicles: [],
          selectDate: now(getLocalTimeZone())
        });
      
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

  const clearSelection = (type: string, id: string) => {
    if (type === 'transfer') {
      setSelectData(prevState => ({
        ...prevState,
        transfer: prevState.transfer.filter(transfer => transfer.transfer._id !== id),
        selectedTransfers: prevState.selectedTransfers.filter(transfer => transfer._id !== id)
      }));
    } else if (type === 'tour') {
      setSelectData(prevState => ({
        ...prevState,
        selectedTours: prevState.selectedTours.filter(tour => tour.tour._id !== id)
      }));
    } else if (type === 'vehicle') {
      setSelectData(prevState => ({
        ...prevState,
        selectedItems: prevState.selectedItems.filter(item => item.vehicle._id !== id),
        selectedVehicles: prevState.selectedVehicles.filter(vehicle => vehicle._id !== id)
      }));
    }
    setIsSubmitDisable(false);
  };

  const handleTravelersChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSelectData(prevState => ({
      ...prevState,
      travelers: { ...prevState.travelers, adults: parseInt(value, 10) }
    }));
  };

  const handleDateChange = (date: any) => {
    setSelectData(prevState => ({
      ...prevState,
      selectDate: date
    }));
  };

  return (
    <div className='flex flex-col w-full bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg h-full md:max-h-[37rem]'>
      
      <div className='w-full text-center mb-4'>
        <h1 className='text-3xl font-bold'>Reservas</h1>
      </div>
      <div className='flex flex-col md:flex-row w-full'>
        <div className='w-full md:w-1/2 p-4 sticky top-0 z-50 transition-all duration-500 overflow-auto max-h-[25rem] scroll-container'>
          <div className='overflow-auto max-h-full scroll-container'>
            <Accordion>
              <AccordionItem key='1' aria-label='Traslados' title='Traslados'>
                <TransfersAccordionItem
                  selectData={selectData}
                  setSelectData={setSelectData}
                  setSelectedTransfer={(transfers) => {
                    const transfersArray = Array.isArray(transfers) ? transfers : [transfers];
                    setSelectData(prevState => ({
                      ...prevState,
                      selectedTransfers: [...prevState.selectedTransfers, ...transfersArray],
                      transfer: [...prevState.transfer, ...transfersArray.map(transfer => ({ transfer, date: selectData.selectDate }))]
                    }));
                  }}
                />
              </AccordionItem>
              <AccordionItem key='2' aria-label='Vehículos' title='Vehículos'>
                <VehiclesAccordionItem
                  categoriesData={categoriesData}
                  vehiclesByCategory={vehiclesByCategory}
                  loading={loading}
                  setVehiclesByCategory={setVehiclesByCategory}
                  setLoading={setLoading}
                  setSelectData={setSelectData}
                  selectData={selectData}
                  setIsSubmitDisable={setIsSubmitDisable}
                  setSelectedVehicle={(vehicles) => {
                    const vehiclesArray = Array.isArray(vehicles) ? vehicles : [vehicles];
                    setSelectData(prevState => ({
                      ...prevState,
                      selectedVehicles: [...prevState.selectedVehicles, ...vehiclesArray],
                      selectedItems: [...prevState.selectedItems, ...vehiclesArray.map(vehicle => ({ vehicle, dates: { start: selectData.selectDate, end: selectData.selectDate } }))]
                    }));
                  }}
                />
              </AccordionItem>
              <AccordionItem key='3' aria-label='Tours' title='Tours'>
                <ToursAccordionItem
                  selectData={selectData}
                  setSelectData={setSelectData}
                  setSelectedTour={(tours) => {
                    const toursArray = Array.isArray(tours) ? tours : [tours];
                    setSelectData(prevState => ({
                      ...prevState,
                      selectedTours: [...prevState.selectedTours, ...toursArray.map(tour => ({ tour, date: selectData.selectDate }))]
                    }));
                  }}
                />
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className='w-full md:w-1/2 p-4'>
          {selectData.selectedTransfers.length > 0 || selectData.selectedTours.length > 0 || selectData.selectedVehicles.length > 0 ? (
            <SelectedItemDetails
              selectData={selectData}
              setSelectDate={setSelectData}
              setIsSubmitDisable={setIsSubmitDisable}
              handleSubmit={handleSubmit}
              isSubmitDisable={isSubmitDisable}
              selectedTransfers={selectData.selectedTransfers}
              selectedTours={selectData.selectedTours}
              selectedVehicles={selectData.selectedVehicles}
              clearSelection={clearSelection}
              selectDate={selectData.selectDate}
              handleTravelersChange={handleTravelersChange}
            />
          ) : (
            <div className='flex flex-col gap-4'>
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                value={selectData.selectDate}
                onChange={handleDateChange}
                label="Selecciona una fecha"
                variant="bordered"
                className='bg-[#D4EDFF] hover:bg-[#D4EDFF] hover:focus-within:bg-[#D4EDFF] rounded-md'
              />
              <div>
                <label htmlFor="travelers" className='block text-sm font-medium text-gray-700'>
                  Cantidad de personas
                </label>
                <select
                  id="travelers"
                  name="travelers"
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                  value={selectData.travelers.adults}
                  onChange={handleTravelersChange}
                >
                  {[...Array(10).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeRental;