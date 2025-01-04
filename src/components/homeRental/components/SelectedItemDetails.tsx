import { Button, Spinner, DatePicker } from '@nextui-org/react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { today, getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
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
  selectedTransfer: ITransfers | null;
  selectedTour: ITours | null;
  selectedVehicle: IVehicles | null;
  clearSelection: () => void;
  selectDate: any;
  handleTravelersChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectedItemDetails: React.FC<SelectedItemDetailsProps> = ({
  selectData,
  setSelectDate,
  setIsSubmitDisable,
  handleSubmit,
  isSubmitDisable,
  selectedTransfer,
  selectedTour,
  selectedVehicle,
  clearSelection,
  selectDate,
  handleTravelersChange
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleDateChange = (value: any) => {
    setSelectDate(value);
    if (value && value.day < today(getLocalTimeZone()).day) {
      setIsSubmitDisable(true);
    } else {
      setIsSubmitDisable(false);
    }
  };

  useEffect(() => {
    let cost = 0;
    if (selectedTransfer) {
      cost = selectedTransfer.price;
    } else if (selectedTour) {
      cost = selectedTour.price;
    } else if (selectedVehicle && selectDate) {
      const start = selectDate?.start as ZonedDateTime;
      const end = selectDate?.end as ZonedDateTime;
      if (start && end) {
        const hours = end.subtract(start).total('hours');
        if (hours <= 4) {
          cost = selectedVehicle.pricePer4;
        } else if (hours <= 8) {
          cost = selectedVehicle.pricePer8;
        } else {
          cost = selectedVehicle.pricePer24;
        }
      }
    }
    setTotalCost(cost);
  }, [selectedTransfer, selectedTour, selectedVehicle, selectDate]);

  const getImage = () => {
    if (selectedTour) return selectedTour.images[0];
    if (selectedVehicle) return selectedVehicle.images[0];
    return 'https://res.cloudinary.com/dxn97o78r/image/upload/v1734914271/jmkcls0uge7hiepr322a.png';
  };

  const handleViewDetails = () => {
    if (selectedVehicle) {
      navigate(`/list-by-category/${selectedVehicle.category._id}`);
    }
  };

  return (
    <div className='w-full p-4 transition-all duration-500 relative max-h-[25rem] overflow-auto scroll-container'>
      <button
        className='absolute top-6 right-6 text-red-500 hover:text-red-700 bg-transparent hover:bg-red-100 rounded-full p-1 transition-colors duration-200 z-20'
        onClick={clearSelection}
      >
        <FaTimes size={20} />
      </button>
      <div className='bg-white bg-opacity-50 backdrop-blur-lg p-4 rounded-lg shadow-lg grid grid-cols-12 gap-4 max-h-[21rem] overflow-y-auto scroll-container'>
        {/* Primera fila: Imagen y DatePicker */}
        {selectedTour || selectedVehicle ? (
          <div className='col-span-12 md:col-span-6'>
            <img
              src={getImage()}
              alt='Placeholder'
              className='w-full h-28 object-cover rounded-lg'
            />
          </div>
        ) : null}

        {selectedVehicle && (
          <div className='col-span-12 md:col-span-6 flex justify-center flex-col'>
            <DatePickerSection
              setSelectData={setSelectDate}
              vehicle={selectedVehicle}
              selectData={selectData}
              setIsSubmitDisable={setIsSubmitDisable}
              initialDate={selectDate}
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
                onChange={handleTravelersChange}
              >
                {[...Array(selectedVehicle.capacity).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedTransfer && (
          <>
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
                    onChange={handleTravelersChange}
                  >
                    {[...Array(selectedTransfer.capacity).keys()].map(num => (
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
                <h3 className='text-lg font-semibold'>{selectedTransfer.name}</h3>
                <p><strong>Capacity:</strong> {selectedTransfer.capacity}</p>
                <p><strong>Estimated Duration:</strong> {selectedTransfer.estimatedDuration}</p>
                <p><strong>Price:</strong> MXN {selectedTransfer.price}</p>
              </div>
            </div>
          </>
        )}

        {selectedTour && (
          <>
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
                <h3 className='text-lg font-semibold'>{selectedTour.name}</h3>
                <p><strong>Description:</strong> {selectedTour.description}</p>
                <p><strong>Capacity:</strong> {selectedTour.capacity}</p>
                <p><strong>Estimated Duration:</strong> {selectedTour.estimatedDuration}</p>
                <p><strong>Price:</strong> MXN {selectedTour.price}</p>
                <p><strong>Start Dates:</strong> {selectedTour.startDates}</p>
                <p><strong>Itinerary:</strong> {selectedTour.itinerary}</p>
              </div>
            </div>
          </>
        )}

        {/* Segunda fila: Detalles del vehículo */}
        {selectedVehicle && (
          <div className='col-span-12'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white rounded-lg shadow-md'>
              <div className='text-sm text-gray-600'>
                <p><strong>Tag:</strong> {selectedVehicle.tag}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Description:</strong> {selectedVehicle.description}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Capacity:</strong> {selectedVehicle.capacity}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Min Rental Hours:</strong> {selectedVehicle.minRentalHours}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Price:</strong> MXN {selectedVehicle.price}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Price per 4 hours:</strong> MXN {selectedVehicle.pricePer4}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Price per 8 hours:</strong> MXN {selectedVehicle.pricePer8}</p>
              </div>
              <div className='text-sm text-gray-600'>
                <p><strong>Price per 24 hours:</strong> MXN {selectedVehicle.pricePer24}</p>
              </div>
            </div>
            <Button
              className='mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg py-1'
              onPress={handleViewDetails}
            >
              Ver detalles
            </Button>
          </div>
        )}
      </div>

      <div className='col-span-12 mt-4'>
       
        <div className='mt-4'>
          <p className='text-lg font-semibold'>Total: MXN {totalCost}</p>
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