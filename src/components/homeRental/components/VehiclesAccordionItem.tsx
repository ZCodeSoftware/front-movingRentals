import { AccordionItem } from '@nextui-org/react';
import { ICategoriesDropdownProps } from '../models/categories-dropdown-props';
import CategoriesDropdown from './CategoriesDropdown';

const VehiclesAccordionItem: React.FC<ICategoriesDropdownProps> = (props) => {
  return (
    <AccordionItem key='2' aria-label='Vehículos' title='Vehículos'>
      <CategoriesDropdown {...props} />
    </AccordionItem>
  );
};

export default VehiclesAccordionItem;