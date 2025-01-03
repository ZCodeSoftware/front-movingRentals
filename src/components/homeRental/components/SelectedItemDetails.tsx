import { Button, Spinner, NextUIProvider, DatePicker } from '@nextui-org/react';
import { FaShoppingCart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { today, getLocalTimeZone } from '@internationalized/date';
import { ISelectData } from '../models/Select-data';
import { ITransfers } from '../../../services/transfers/models/transfers.interface';
import { ITours } from '../../../services/products/models/tours.interface';
import { IVehicles } from '../../../services/products/models/vehicles.interface';

interface SelectedItemDetailsProps {
  selectData: ISelectData;
  setSelectDate: React.Dispatch<React.SetStateAction<any>>;
  setIsSubmitDisable: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: () => void;
  isSubmitDisable: boolean;
  selectedTransfer: ITransfers | null;
  selectedTour: ITours | null;
  selectedVehicle: IVehicles | null;
}

const SelectedItemDetails: React.FC<SelectedItemDetailsProps> = ({
  selectData,
  setSelectDate,
  setIsSubmitDisable,
  handleSubmit,
  isSubmitDisable,
  selectedTransfer,
  selectedTour,
  selectedVehicle
}) => {
  const { t, i18n } = useTranslation();

  return (
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
              defaultValue={selectData.selectedItems[0]?.dates?.start}
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
  );
};

export default SelectedItemDetails;