import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Select,
  SelectItem,
  Skeleton
} from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import { fetchProducts } from '../../../services/products/productsService'
import { ICategoriesDropdownProps } from '../models/categories-dropdown-props'
import { IProducts } from '../../../services/products/models/products.interface'
import { ISelectData } from '../models/Select-data'

const CategoriesDropdown: React.FC<ICategoriesDropdownProps> = ({
  categoriesData,
  productsByCategory,
  selectedItemsByCategory,
  loading,
  setProductsByCategory,
  setSelectedItemsByCategory,
  setLoading,
  setSelectData
}) => {
  const { t } = useTranslation()

  const getData = async (categoryId: string) => {
    if (categoryId && !productsByCategory[categoryId]) {
      setLoading(prev => ({ ...prev, [categoryId]: true }))
      const result = await fetchProducts(categoryId)
      setProductsByCategory(prev => ({
        ...prev,
        [categoryId]: result
      }))
      setLoading(prev => ({ ...prev, [categoryId]: false }))
    }
  }

  const handleSelectionChange = (categoryId: string, selectedKeys: any) => {
    setSelectedItemsByCategory(prev => ({
      ...prev,
      [categoryId]: new Set(selectedKeys)
    }))

    const selectedProducts = Array.from(selectedKeys)
      .map(id => productsByCategory[categoryId]?.find((product: IProducts) => product._id === id))
      .filter((product): product is IProducts => product !== undefined)

    setSelectData((prev: ISelectData) => ({
      ...prev,
      selectedItem: [
        ...prev.selectedItem.filter((item: IProducts) => item.category._id !== categoryId),
        ...selectedProducts
      ]
    }))
  }

  return (
    <div className='flex flex-row md:justify-center items-center p-2 overflow-hidden'>
      <Dropdown closeOnSelect={false} className='max-w-full md:w-[500px]'>
        <DropdownTrigger>
          <Button className='w-44 h-14' style={{ backgroundColor: '#D4EDFF', borderRadius: '50' }}>
            {t('HomeRental.categories')}
          </Button>
        </DropdownTrigger>
        <DropdownMenu className='w-full p-4 bg-white shadow-lg rounded-lg'>
          {categoriesData && categoriesData.length > 0 ? (
            categoriesData.map(c => (
              <DropdownItem key={c._id} className='w-full' isReadOnly>
                <Select
                  selectionMode='multiple'
                  className='w-full truncate container'
                  label={c.name}
                  renderValue={() => {
                    const count = selectedItemsByCategory[c._id]?.size || 0
                    return count > 0 ? `${count} ${t('HomeRental.selected_items')}` : ''
                  }}
                  data-filled={true}
                  data-has-value={true}
                  onOpenChange={async isOpen => {
                    if (isOpen) {
                      await getData(c._id)
                    }
                  }}
                  onSelectionChange={selectedKeys => handleSelectionChange(c._id, selectedKeys)}
                  selectedKeys={selectedItemsByCategory[c._id] || new Set()}
                >
                  {loading[c._id] ? (
                    <SelectItem key='skeleton-1' isDisabled>
                      <Skeleton className='w-full h-6 rounded-lg mb-2'></Skeleton>
                      <Skeleton className='w-[80%] h-6 rounded-lg mb-2'></Skeleton>
                      <Skeleton className='w-[60%] h-6 rounded-lg'></Skeleton>
                    </SelectItem>
                  ) : productsByCategory[c._id]?.length > 0 ? (
                    productsByCategory[c._id].map(p => (
                      <SelectItem key={p._id} className='text-center'>
                        {p.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key='no-products' className='text-gray-500 text-center'>
                      {t('HomeRental.no_products_available')}
                    </SelectItem>
                  )}
                </Select>
              </DropdownItem>
            ))
          ) : (
            <DropdownItem className='text-center text-gray-500'>{t('HomeRental.no_categories_available')}</DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default CategoriesDropdown
