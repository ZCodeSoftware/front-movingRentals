import { ICategoriesDropdownProps } from '../models/categories-dropdown-props';
import CategoriesDropdown from './CategoriesDropdown';

const VehiclesAccordionItem: React.FC<ICategoriesDropdownProps> = (props) => {
  return (
      <CategoriesDropdown {...props} />
  );
};

export default VehiclesAccordionItem;