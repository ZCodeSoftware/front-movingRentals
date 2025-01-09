import { useState, useEffect } from 'react';
import { Button, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ITransfers } from '../../../services/transfers/models/transfers.interface';
import { fetchTransfers } from '../../../services/transfers/GET/transfers.get.service';
import { ISelectData } from '../models/Select-data';

interface TransfersAccordionItemProps {

  selectData: ISelectData;

  setSelectData: React.Dispatch<React.SetStateAction<ISelectData>>;

  setSelectedTransfer: React.Dispatch<React.SetStateAction<ITransfers[]>>;

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

  const handleSave = (transfer: ITransfers) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      transfer: [...prev.transfer, { transfer, date: new Date() }]
    }));
    setSelectedTransfer([transfer]);
  };

  const handleRemove = (transfer: ITransfers) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      transfer: prev.transfer.filter((item: any) => item.transfer._id !== transfer._id)
    }));
    setSelectedTransfer([]);
  };

  return (
    <div className='w-full overflow-auto p-4'>
      {loading ? (
        <Skeleton className='w-full h-6 rounded-lg mb-2' />
      ) : transfers?.length > 0 ? (
        transfers.map(transfer => (
          <div key={transfer._id} className='w-full flex flex-col justify-center items-center'>
            <Button
              className='w-full m-2'
              onPress={() => {
                if (selectData.transfer.some(s => s.transfer._id === transfer._id)) {
                  handleRemove(transfer);
                } else {
                  handleSave(transfer);
                }
              }}
            >
              {transfer.name}
            </Button>
            {selectData.transfer.some(s => s.transfer._id === transfer._id) && (
              <Button
                className='h-full ml-2 flex items-center justify-center'
                onPress={() => handleRemove(transfer)}
                color='danger'
                variant='flat'
              >
                Eliminar
              </Button>
            )}
          </div>
        ))
      ) : (
        <div className='text-center text-gray-500'>{t('HomeRental.no_products_available')}</div>
      )}
    </div>
  );
};

export default TransfersAccordionItem;