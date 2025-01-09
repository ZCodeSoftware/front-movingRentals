import { useState, useEffect } from 'react';
import { Button, Skeleton } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { ITours } from '../../../services/products/models/tours.interface';
import { fetchAllTours } from '../../../services/products/tours/GET/tours.get.service';
import { ISelectData } from '../models/Select-data';
import { getLocalStorage } from '../../../utils/local-storage/getLocalStorage';

interface ToursAccordionItemProps {
  selectData: ISelectData;
  setSelectData: React.Dispatch<React.SetStateAction<ISelectData>>;
  setSelectedTour: React.Dispatch<React.SetStateAction<ITours[]>>;
}

const ToursAccordionItem: React.FC<ToursAccordionItemProps> = ({ selectData, setSelectData, setSelectedTour }) => {
  const { t } = useTranslation();
  const [tours, setTours] = useState<ITours[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getToursData = async () => {
      if (!loading && tours.length === 0) {
        setLoading(true);
        try {
          const result = await fetchAllTours();
          setTours(result);
        } catch (error) {
          console.error('Error fetching tours:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    getToursData();
  }, [loading, tours]);

  const isAlreadySelected = (id: string) => {
    const localBackCart = getLocalStorage('backCart');
    const localCart = getLocalStorage('cart');
    const isInBackCart = localBackCart?.tour?.some((item: any) => item.tour === id);
    const isInLocalCart = localCart?.tour?.some((item: any) => item.tour === id);

    return isInBackCart || isInLocalCart;
  };

  const handleRemove = (tour: ITours) => {
    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedTours: prev.selectedTours.filter((item: any) => item.tour._id !== tour._id)
    }));
    setSelectedTour((prev: ITours[]) => prev.filter((item: ITours) => item._id !== tour._id));
  };

  return (
    <div className='w-full h-[30rem] overflow-auto p-4'>
      {loading ? (
        <Skeleton className='w-full h-6 rounded-lg mb-2' />
      ) : tours?.length > 0 ? (
        tours.map(tour => (
          <div key={tour._id} className='w-full flex flex-col justify-center items-center'>
            <Button
              className='w-full m-2'
              onPress={() => setSelectedTour([tour])}
            >
              {tour.name}
            </Button>
            <div>
              {isAlreadySelected(tour._id) ? (
                <Button className='h-full ml-2 flex items-center justify-center text-wrap' isDisabled>
                  En el carrito
                </Button>
              ) : (
                <>
                  {selectData.selectedTours.some(s => s.tour._id === tour._id) ? (
                    <Button
                      className='h-full ml-2 flex items-center justify-center'
                      onPress={() => handleRemove(tour)}
                      color='danger'
                      variant='flat'
                    >
                      Eliminar
                    </Button>
                  ) : (
                   <></>
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
  );
};

export default ToursAccordionItem;