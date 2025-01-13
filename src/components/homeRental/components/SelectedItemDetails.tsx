import { Button, Spinner, DatePicker } from '@nextui-org/react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { today, getLocalTimeZone, ZonedDateTime } from '@internationalized/date';
import { ISelectData } from '../models/Select-data';
import { ITransfers } from '../../../services/transfers/models/transfers.interface';
import { ITours } from '../../../services/products/models/tours.interface';
import { IVehicles } from '../../../services/products/models/vehicles.interface';
import DatePickerSection from './DatePicker';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SelectedItemDetailsProps {
  selectData: ISelectData;
  setSelectDate: React.Dispatch<React.SetStateAction<any>>;
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
  isSubmitDisable: boolean;
  selectedTransfers: ITransfers[];
  selectedTours: { tour: ITours }[];
  selectedVehicles: IVehicles[];
  clearSelection: (type: string, id: string) => void;
  selectDate: any;
  handleTravelersChange: (event: React.ChangeEvent<HTMLSelectElement>, id: string) => void;
}

const SelectedItemDetails: React.FC<SelectedItemDetailsProps> = ({
  selectData,
  setSelectDate,
  setIsSubmitDisable,
  handleSubmit,
  isSubmitDisable,
  selectedTransfers,
  selectedTours,
  selectedVehicles,
  clearSelection,
  selectDate,
  handleTravelersChange
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState<number>(0);

  console.log(selectedTours);

  const handleDateChange = (value: any) => {
    console.log('handleDateChange - value:', value);
    if (!(value instanceof ZonedDateTime)) {
      console.log('handleDateChange - converting value to ZonedDateTime');
      value = ZonedDateTime.from(value);
    }
    console.log('handleDateChange - converted value:', value);
    setSelectDate(value);
    if (value && value.day < today(getLocalTimeZone()).day) {
      setIsSubmitDisable(true);
    } else {
      setIsSubmitDisable(false);
    }
  };

  const calculateVehiclePrice = ({ vehicle, dates }: { vehicle: IVehicles; dates: { start: ZonedDateTime; end: ZonedDateTime } }) => {
    console.log('calculateVehiclePrice - dates:', dates);
    if (!(dates.start instanceof ZonedDateTime)) {
      console.log('calculateVehiclePrice - converting start date to ZonedDateTime');
      dates.start = ZonedDateTime.from(dates.start);
    }
    if (!(dates.end instanceof ZonedDateTime)) {
      console.log('calculateVehiclePrice - converting end date to ZonedDateTime');
      dates.end = ZonedDateTime.from(dates.end);
    }
    console.log('calculateVehiclePrice - converted dates:', dates);
    const { price, pricePer4, pricePer8, pricePer24 } = vehicle;
    if (price === undefined || pricePer4 === undefined || pricePer8 === undefined || pricePer24 === undefined) {
      throw new Error('Los precios del vehículo deben estar definidos.');
    }
    const differenceInMilliseconds = dates.end.toDate().getTime() - dates.start.toDate().getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

    let totalPrice = 0;

    if (differenceInHours >= 24) {
      const fullDays = Math.floor(differenceInHours / 24);
      totalPrice += fullDays * pricePer24;
      const remainingHours = differenceInHours % 24;

      totalPrice += calculateRemainingPrice(remainingHours, price, pricePer4, pricePer8);
    } else {
      totalPrice += calculateRemainingPrice(differenceInHours, price, pricePer4, pricePer8);
    }
    return totalPrice;
  };

  const calculateRemainingPrice = (hours: number, price: number, pricePer4: number, pricePer8: number) => {
    let cost = 0;
    if (hours >= 8) {
      const fullBlocksOf8 = Math.floor(hours / 8);
      cost += fullBlocksOf8 * pricePer8;
      hours %= 8;
    }

    if (hours >= 4) {
      const fullBlocksOf4 = Math.floor(hours / 4);
      cost += fullBlocksOf4 * pricePer4;
      hours %= 4;
    }

    if (hours > 0) {
      cost += hours * price;
    }

    return cost;
  };

  useEffect(() => {
    let cost = 0;
    selectedTransfers.forEach(transfer => {
      cost += transfer.price;
    });
    selectedTours.forEach(({ tour }) => {
      cost += tour.price;
    });

    if (Array.isArray(selectedVehicles)) {
      selectedVehicles.forEach(vehicle => {
        if (selectData && selectData.selectedItems) {
          selectData.selectedItems.forEach((item: { vehicle: IVehicles; dates: { start: ZonedDateTime; end: ZonedDateTime } }) => {
            const { vehicle, dates } = item;
            console.log('useEffect - selectedVehicles - dates:', dates);
            if (dates && dates.start && dates.end) {
              cost += calculateVehiclePrice({ vehicle, dates });
            }
          });
        }
      });
    } else if (selectedVehicles && typeof selectedVehicles === 'object') {
      const vehicle = selectedVehicles;
      if (selectData && selectData.selectedItems) {
        selectData.selectedItems.forEach((item: { vehicle: IVehicles; dates: { start: ZonedDateTime; end: ZonedDateTime } }) => {
          const { vehicle, dates } = item;
          console.log('useEffect - selectedVehicles (object) - dates:', dates);
          if (dates && dates.start && dates.end) {
            cost += calculateVehiclePrice({ vehicle, dates });
          }
        });
      }
    }

    setTotalCost(cost);
  }, [selectedTransfers, selectedTours, selectedVehicles, selectData]);

  console.log(totalCost);
  

  const getTourImage = (tour: ITours) => {
    return tour.images && tour.images.length > 0 ? tour.images[0] : 'https://via.placeholder.com/150'; // Reemplaza 'https://via.placeholder.com/150' con una URL de imagen predeterminada
  };

  const getVehicleImage = (vehicle: IVehicles) => {
    return vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : 'https://via.placeholder.com/150'; // Reemplaza 'https://via.placeholder.com/150' con una URL de imagen predeterminada
  };

  const handleViewDetails = (categoryId: string) => {
    navigate(`/list-by-category/${categoryId}`);
  };

  const formatText = (text: string) => {
    if (!text) return null;
    return text.split('\\n').map((line, index) => (
      <p key={index}>{line}</p>
    ));
  };

  return (
    <div className='w-full p-4 transition-all duration-500 relative max-h-[25rem] overflow-auto scroll-container'>
      {selectedTours.map(({ tour }) => (
        <div key={tour._id} className='mb-4 relative'>
          <button
            className='absolute top-6 right-6 text-red-500 hover:text-red-700 bg-transparent hover:bg-red-100 rounded-full p-1 transition-colors duration-200 z-20'
            onClick={() => clearSelection('tour', tour._id)}
          >
            <FaTimes size={20} />
          </button>
          <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg grid grid-cols-12 gap-4 max-h-[21rem] overflow-y-auto scroll-container'>
            <div className='col-span-12 md:col-span-6'>
              <img
                src={getTourImage(tour)}
                alt='Placeholder'
                className='w-full h-28 object-cover rounded-lg'
              />
            </div>
            <div className='col-span-12 md:col-span-6 flex justify-center'>
              <DatePicker
                className='w-full'
                label='Fecha del Tour'
                onChange={handleDateChange}
                validate={(value: any) => {
                  if (value && value.day < today(getLocalTimeZone()).day) {
                    setIsSubmitDisable(true);
                    return t('HomeRental.date_picker.previous_day_valid');
                  } else {
                    setIsSubmitDisable(false);
                  }
                  return true;
                }}
                value={selectDate}
              />
            </div>
            <div className='col-span-12'>
              <div className='bg-white bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-lg flex-grow'>
                <h3 className='text-lg font-semibold'>{tour.name}</h3>
                <p><strong>Description:</strong> {formatText(tour.description)}</p>
                <p><strong>Capacity:</strong> {tour.capacity}</p>
                <p><strong>Estimated Duration:</strong> {tour.estimatedDuration}</p>
                <p><strong>Price:</strong> MXN {tour.price}</p>
                <p><strong>Start Dates:</strong> {tour.startDates}</p>
                <p><strong>Itinerary:</strong> {formatText(tour.itinerary)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {Array.isArray(selectedVehicles) ? selectedVehicles.map(vehicle => (
        <div key={vehicle._id} className='mb-4 relative'>
          <button
            className='absolute top-6 right-6 text-red-500 hover:text-red-700 bg-transparent hover:bg-red-100 rounded-full p-1 transition-colors duration-200 z-20'
            onClick={() => clearSelection('vehicle', vehicle._id)}
          >
            <FaTimes size={20} />
          </button>
          <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg grid grid-cols-12 gap-4 max-h-[21rem] overflow-y-auto scroll-container'>
            <div className='col-span-12 md:col-span-6'>
              <img
                src={getVehicleImage(vehicle)}
                alt='Placeholder'
                className='w-full h-28 object-cover rounded-lg'
              />
            </div>
            <div className='col-span-12 md:col-span-6 flex justify-center flex-col'>
              <DatePickerSection
                setSelectData={setSelectDate}
                vehicle={vehicle}
                selectData={selectData}
                setIsSubmitDisable={setIsSubmitDisable}
              />
              <div>
                <label htmlFor="travelers" className='block text-sm font-medium text-gray-700 mt-2'>
                  Cantidad de personas
                </label>
                <select
                  id="travelers"
                  name="travelers"
                  className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                  value={selectData.travelers.adults}
                  onChange={(event) => handleTravelersChange(event, vehicle._id)}
                >
                  {[...Array(vehicle.capacity).keys()].map(num => (
                    <option key={num + 1} value={num + 1}>
                      {num + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className='col-span-12'>
              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg shadow-md'>
                <div className='text-sm text-gray-600'>
                  <p><strong>Tag:</strong> {vehicle.tag}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Description:</strong> {vehicle.description}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Capacity:</strong> {vehicle.capacity}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Min Rental Hours:</strong> {vehicle.minRentalHours}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Price:</strong> MXN {vehicle.price}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Price per 4 hours:</strong> MXN {vehicle.pricePer4}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Price per 8 hours:</strong> MXN {vehicle.pricePer8}</p>
                </div>
                <div className='text-sm text-gray-600'>
                  <p><strong>Price per 24 hours:</strong> MXN {vehicle.pricePer24}</p>
                </div>
              </div>
              <Button
                className='mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg py-1'
                onPress={() => handleViewDetails(vehicle.category._id)}
              >
                Ver detalles
              </Button>
            </div>
          </div>
        </div>
      )) : null}

      {selectedTransfers.map(transfer => (
        <div key={transfer._id} className='mb-4 relative'>
          <button
            className='absolute top-6 right-6 text-red-500 hover:text-red-700 bg-transparent hover:bg-red-100 rounded-full p-1 transition-colors duration-200 z-20'
            onClick={() => clearSelection('transfer', transfer._id)}
          >
            <FaTimes size={20} />
          </button>
          <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg grid grid-cols-12 gap-4 max-h-[21rem] overflow-y-auto scroll-container'>
            <div className='col-span-12 md:col-span-5 flex justify-center flex-col'>
              <DatePicker
                className='w-full'
                label='Fecha del Traslado'
                onChange={handleDateChange}
                validate={(value: any) => {
                  if (value && value.day < today(getLocalTimeZone()).day) {
                    setIsSubmitDisable(true);
                    return t('HomeRental.date_picker.previous_day_valid');
                  } else {
                    setIsSubmitDisable(false);
                  }
                  return true;
                }}
                value={selectDate}
              />
              <div className='flex flex-col gap-4 mt-4'>
                <div>
                  <label htmlFor="travelers" className='block text-sm font-medium text-gray-700'>
                    Cantidad de personas
                  </label>
                  <select
                    id="travelers"
                    name="travelers"
                    className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                    value={selectData.travelers.adults}
                    onChange={(event) => handleTravelersChange(event, transfer._id)}
                  >
                    {[...Array(transfer.capacity).keys()].map(num => (
                      <option key={num + 1} value={num + 1}>
                        {num + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className='col-span-12 md:col-span-7'>
              <div className='bg-white bg-opacity-50 backdrop-blur-lg p-6 rounded-lg shadow-lg flex-grow'>
                <h3 className='text-lg font-semibold'>{transfer.name}</h3>
                <p><strong>Capacity:</strong> {transfer.capacity}</p>
                <p><strong>Estimated Duration:</strong> {transfer.estimatedDuration}</p>
                <p><strong>Price:</strong> MXN {transfer.price}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className='col-span-12 mt-4'>
        <div className='mt-4'>
          <p className='text-lg font-semibold'>Total: MXN {totalCost.toFixed(2)}</p>
        </div>
        <Button
          className='w-full p-2 h-10 bg-buttonPrimary flex justify-center items-center text-xs font-semibold mt-4'
          isDisabled={isSubmitDisable}
          onPress={handleSubmit}
        >
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
  );
};

export default SelectedItemDetails;