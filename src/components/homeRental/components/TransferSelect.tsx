import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Skeleton,
  Button,
  NextUIProvider,
  DatePicker
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { FaBus, FaChevronDown } from 'react-icons/fa';
import { ITransferSelectProps } from '../models/transfer-select-props';
import { fetchTransfers } from '../../../services/transfers/GET/transfers.get.service';
import { ITransfers } from '../../../services/transfers/models/transfers.interface';
import { getLocalTimeZone, now, ZonedDateTime } from '@internationalized/date';
import { ISelectData } from '../models/Select-data';
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage';

const TransferSelector: React.FC<ITransferSelectProps> = ({
  loading,
  setLoading,
  setSelectData,
  setIsSubmitDisable,
  selectData
}) => {
  const { t } = useTranslation();
  const [transfers, setTransfers] = useState<ITransfers[]>([]);
  const [openPickers, setOpenPickers] = useState(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectDate, setSelectDate] = useState<ZonedDateTime>(now(getLocalTimeZone()));
  const { i18n } = useTranslation();
  const localBackCart = getLocalStorage('backCart');
  const localCart = getLocalStorage('cart');

  const getData = async () => {
    if (!loading.transfer && transfers.length === 0) {
      setLoading(prev => ({ ...prev, transfers: true }));
      try {
        const result = await fetchTransfers();
        setTransfers(result);
      } catch (error) {
        console.error('Error fetching tours:', error);
      } finally {
        setLoading(prev => ({ ...prev, tours: false }));
      }
    }
  };

  const isAlreadySelected = (transferId: string) => {
    const isInBackCart = localBackCart?.transfer.some((item: any) => item.transfer === transferId);
    const isInLocalCart = localCart?.transfer.some((item: any) => item.transfer === transferId);

    return isInBackCart || isInLocalCart;
  };

  const handleDropdownOpenChange = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
    if (isOpen) {
      getData();
    }
  };

  const handleSave = (transfer: ITransfers) => {
    if (selectDate) {
      setSelectData((prev: ISelectData) => {
        const existingItemIndex = prev.transfer.findIndex(item => item.transfer._id === transfer._id);

        const newItem = {
          date: selectDate,
          transfer: transfer
        };

        if (existingItemIndex > -1) {
          const updatedTransfer = [...prev.transfer];
          updatedTransfer[existingItemIndex] = newItem;
          return {
            ...prev,
            transfer: updatedTransfer
          };
        }

        return {
          ...prev,
          transfer: [...prev.transfer, newItem]
        };
      });
    }
  };

  const handleRemove = (transfer: ITransfers) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      transfer: prev.transfer.filter(item => item.transfer._id !== transfer._id)
    }));
  };

  return (
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden w-full md:w-auto '>
      <Dropdown
        closeOnSelect={false}
        className='w-full'
        isOpen={isDropdownOpen}
        onOpenChange={handleDropdownOpenChange}
      >
        <DropdownTrigger>
          <Button className='w-full h-14 flex justify-between items-center bg-[#D4EDFF] rounded-full'>
            <FaBus className='ml-2' />
            <span className='font-semibold'>Traslados</span>
            <FaChevronDown className='mr-2' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='w-full p-4 bg-white shadow-lg rounded-lg'>
          {loading.transfer ? (
            <DropdownItem isReadOnly>
              <div className='w-full'>
                <Skeleton className='w-full h-6 rounded-lg mb-2' />
                <Skeleton className='w-[80%] h-6 rounded-lg mb-2' />
                <Skeleton className='w-[60%] h-6 rounded-lg' />
              </div>
            </DropdownItem>
          ) : transfers?.length > 0 ? (
            transfers.map(transfer => (
              <DropdownItem key={transfer._id} className='w-full' isReadOnly>
                <div className='w-full flex flex-col justify-center items-center'>
                  <Button
                    className='w-full m-2'
                    onPress={() =>
                      setOpenPickers(prev =>
                        prev.has(transfer._id)
                          ? new Set([...prev].filter(id => id !== transfer._id))
                          : new Set(prev).add(transfer._id)
                      )
                    }
                  >
                    {transfer.name}
                  </Button>
                  {openPickers.has(transfer._id) && (
                    <div className='w-full h-full flex justify-center'>
                      <NextUIProvider className='w-full flex justify-center' locale={i18n.language}>
                        <DatePicker
                          className='w-full'
                          classNames={{
                            inputWrapper: 'bg-[#D4EDFF] hover:bg-[#D4EDFF] hover:focus-within:bg-[#D4EDFF]'
                          }}
                          onChange={e => setSelectDate(e)}
                          validate={(value: any) => {
                            if (value.day < now(getLocalTimeZone()).day) {
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
                      <div>
                        {isAlreadySelected(transfer._id) ? (
                          <Button className='h-full ml-2 flex items-center justify-center text-wrap' isDisabled>
                            En el carrito
                          </Button>
                        ) : (
                          <>
                            {selectData.transfer.some(s => s.transfer._id === transfer._id) ? (
                              <Button
                                className='h-full ml-2 flex items-center justify-center'
                                onPress={() => handleRemove(transfer)}
                                color='danger'
                                variant='flat'
                              >
                                Eliminar
                              </Button>
                            ) : (
                              <Button
                                className='h-full ml-2 flex items-center justify-center'
                                onPress={() => handleSave(transfer)}
                              >
                                Agregar
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DropdownItem>
            ))
          ) : (
            <DropdownItem className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default TransferSelector;