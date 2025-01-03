import { useState, useEffect } from 'react';
import { AccordionItem, Button, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ITransfers } from '../../../services/transfers/models/transfers.interface';
import { fetchTransfers } from '../../../services/transfers/GET/transfers.get.service';
import { ISelectData } from '../models/Select-data';
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage';

interface TransfersAccordionItemProps {
  selectData: ISelectData;
  setSelectData: React.Dispatch<React.SetStateAction<ISelectData>>;
  setSelectedTransfer: React.Dispatch<React.SetStateAction<ITransfers | null>>;
}

const TransfersAccordionItem: React.FC<TransfersAccordionItemProps> = ({ selectData, setSelectData, setSelectedTransfer }) => {
  const { t } = useTranslation();
  const [transfers, setTransfers] = useState<ITransfers[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTransfersData = async () => {
      if (!loading && transfers.length === 0) {
        setLoading(true);
        try {
          const result = await fetchTransfers();
          setTransfers(result);
        } catch (error) {
          console.error('Error fetching transfers:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    getTransfersData();
  }, [loading, transfers]);

  const isAlreadySelected = (id: string) => {
    const localBackCart = getLocalStorage('backCart');
    const localCart = getLocalStorage('cart');
    const isInBackCart = localBackCart?.transfer?.some((item: any) => item.transfer === id);
    const isInLocalCart = localCart?.transfer?.some((item: any) => item.transfer === id);

    return isInBackCart || isInLocalCart;
  };

  const handleSave = (transfer: ITransfers) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      transfer: [...prev.transfer, { transfer, date: new Date() }]
    }));
  };

  const handleRemove = (transfer: ITransfers) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      transfer: prev.transfer.filter((item: any) => item.transfer._id !== transfer._id)
    }));
  };

  return (
    <AccordionItem key='1' aria-label='Traslados' title={t('HomeRental.transfers.title')}>
      <div className='w-full h-[30rem] overflow-auto p-4'>
        {loading ? (
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
          ))
        ) : (
          <div className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</div>
        )}
      </div>
    </AccordionItem>
  );
};

export default TransfersAccordionItem;