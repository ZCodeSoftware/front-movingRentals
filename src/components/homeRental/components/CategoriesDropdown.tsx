import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Skeleton,
  Accordion,
  AccordionItem
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { FaCar, FaChevronDown } from 'react-icons/fa';
import { fetchVehicles } from '../../../services/products/vehicles/GET/vehicles.get.service';
import { ICategoriesDropdownProps } from '../models/categories-dropdown-props';
import { CATEGORIES } from '../constants/homeRental.constants';
import DatePickerSection from './DatePicker';

const CategoriesDropdown: React.FC<ICategoriesDropdownProps> = ({
  categoriesData,
  vehiclesByCategory,
  loading,
  setVehiclesByCategory,
  setLoading,
  setSelectData,
  selectData,
  setIsSubmitDisable
}) => {
  const { t } = useTranslation();
  const [openPickers, setOpenPickers] = useState(new Set());

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
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden w-full md:w-auto'>
      <Dropdown closeOnSelect={false} className='w-full'>
        <DropdownTrigger>
          <Button className='w-full h-14 flex justify-between items-center bg-[#D4EDFF] rounded-full'>
            <FaCar className='ml-2' />
            <span className='font-semibold'>{t('HomeRental.vehicles')}</span>
            <FaChevronDown className='mr-2' />
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='w-full p-4 bg-white shadow-lg rounded-lg'>
          {categoriesData && categoriesData.length > 0 ? (
            categoriesData
              .filter(c => c.name !== CATEGORIES.TOURS && c.name !== CATEGORIES.TRANSFERS)
              .map(c => (
                <DropdownItem key={c._id} className='w-full' isReadOnly>
                  <Accordion className='text-black'>
                    <AccordionItem key={c._id} className='cursor-pointer' title={c.name} onPress={() => getData(c._id)}>
                      {loading[c._id] ? (
                        <div className='w-full'>
                          <Skeleton className='w-full h-6 rounded-lg mb-2' />
                          <Skeleton className='w-[80%] h-6 rounded-lg mb-2' />
                          <Skeleton className='w-[60%] h-6 rounded-lg' />
                        </div>
                      ) : vehiclesByCategory[c._id]?.length > 0 ? (
                        vehiclesByCategory[c._id].map(p => (
                          <div key={p._id} className='text-center'>
                            <Button
                              className='w-full m-2'
                              onPress={() =>
                                setOpenPickers(prev =>
                                  prev.has(p._id)
                                    ? new Set([...prev].filter(id => id !== p._id))
                                    : new Set(prev).add(p._id)
                                )
                              }
                            >
                              {p.name}
                            </Button>
                            {openPickers.has(p._id) && (
                              <div className='w-full flex justify-center'>
                                <DatePickerSection
                                  setSelectData={setSelectData}
                                  vehicle={p}
                                  selectData={selectData}
                                  setIsSubmitDisable={setIsSubmitDisable}
                                />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className='text-gray-500 text-center'>{t('HomeRental.no_products_available')}</div>
                      )}
                    </AccordionItem>
                  </Accordion>
                </DropdownItem>
              ))
          ) : (
            <DropdownItem className='text-center text-gray-500'>{t('HomeRental.no_categories_available')}</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default CategoriesDropdown;