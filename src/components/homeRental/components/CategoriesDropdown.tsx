import {
  Button,
  Skeleton,
  Accordion,
  AccordionItem
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { fetchVehicles } from '../../../services/products/vehicles/GET/vehicles.get.service';
import { ICategoriesDropdownProps } from '../models/categories-dropdown-props';
import { CATEGORIES } from '../constants/homeRental.constants';

const CategoriesAccordion: React.FC<ICategoriesDropdownProps> = ({
  categoriesData,
  vehiclesByCategory,
  loading,
  setVehiclesByCategory,
  setLoading,
  setSelectedVehicle
}) => {
  const { t } = useTranslation();

  const getData = async (categoryId: string) => {
    if (categoryId && !vehiclesByCategory[categoryId]) {
      setLoading(prev => ({ ...prev, [categoryId]: true }));
      const result = await fetchVehicles(categoryId);
      setVehiclesByCategory(prev => ({
        ...prev,
        [categoryId]: result
      }));
      setLoading(prev => ({ ...prev, [categoryId]: false }));
    }
  };

  return (
    <Accordion>
      {categoriesData && categoriesData.length > 0 ? (
        categoriesData
          .filter(c => c.name !== CATEGORIES.TOURS && c.name !== CATEGORIES.TRANSFERS && c.name !== CATEGORIES.TICKETS)
          .map(c => (
            <AccordionItem key={c._id} className='cursor-pointer' title={
              <div className='flex items-center'>
                <img src={c.image} alt={c.name} className='w-14 h-14 mr-2 rounded-full' />
                {c.name}
              </div>
            } onPress={() => getData(c._id)}>
              {loading[c._id] ? (
                <div className='w-full'>
                  <Skeleton className='w-full h-6 rounded-lg mb-2' />
                  <Skeleton className='w-[80%] h-6 rounded-lg mb-2' />
                  <Skeleton className='w-[60%] h-6 rounded-lg' />
                </div>
              ) : vehiclesByCategory[c._id]?.length > 0 ? (
                vehiclesByCategory[c._id].map(p => (
                  <div key={p._id} className='text-center p-4 bg-white shadow-md rounded-lg mb-4'>
                    <Button
                      className='w-full m-2 flex items-center justify-start p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition'
                      onPress={() => {
                        setSelectedVehicle(p);
                      }}
                    >
                      {p.images && p.images.length > 0 && (
                        <img src={p.images[0]} alt={p.tag} className='w-16 h-16 mr-4 rounded-md' />
                      )}
                      <span className='text-left'>{p.tag}</span>
                    </Button>                    
                  </div>
                ))
              ) : (
                <div className='text-gray-500 text-center'>{t('HomeRental.no_products_available')}</div>
              )}
            </AccordionItem>
          ))
      ) : (
        <AccordionItem key={"no category"} className='text-center text-gray-500'>{t('HomeRental.no_categories_available')}</AccordionItem>
      )}
    </Accordion>
  );
};

export default CategoriesAccordion;