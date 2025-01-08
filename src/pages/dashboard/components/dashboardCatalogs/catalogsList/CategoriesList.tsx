import { Table, TableBody, TableHeader, TableCell, TableColumn, TableRow, Tooltip, Button } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { ICategories } from '../../../../../services/categories/models/categories.interface'
import { fetchCategories } from '../../../../../services/categories/categoriesService'
import UpdateCategory from '../updateCatalogs/updateCategory'

const CategoriesList = () => {
  const [loading, setLoading] = useState(true)
  const [CategoriesData, setCategoriesData] = useState<ICategories[]>([])
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [selectedCategory, setselectedCategory] = useState<ICategories | null>(null)

  const getData = async () => {
    const result = await fetchCategories()
    setCategoriesData(result)
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleEditClick = (category: ICategories) => {
    setselectedCategory(category)
    setOpenUpdateModal(true)
  }

  return (
    <>
      {!loading && (
        <div className='w-full h-full flex justify-center items-center py-4'>
          <Table aria-label='Tabla de usuarios'>
            <TableHeader>
              <TableColumn>Imagen</TableColumn>
              <TableColumn>Nombre</TableColumn>
              <TableColumn>Aviso en español</TableColumn>
              <TableColumn>Aviso en inglés</TableColumn>
              <TableColumn>Acciones</TableColumn>
            </TableHeader>
            <TableBody>
              {CategoriesData.map(t => (
                <TableRow key={t._id}>
                  <TableCell>
                    <img sizes='100px' src={t.image} className='w-[100px] h-[100px]' />
                  </TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        <div className='w-48 max-h-48 overflow-y-auto overflow-x-hidden px-2 py-2 break-wordsbreak-words whitespace-pre-line'>
                          {t.disclaimerEs}
                        </div>
                      }
                      placement='bottom'
                      showArrow
                    >
                      <div className='text-ellipsis max-w-48 text-nowrap overflow-hidden'>{t.disclaimerEs}</div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      content={
                        <div className='w-48 max-h-48 overflow-y-auto overflow-x-hidden px-2 py-2 break-wordsbreak-words whitespace-pre-line'>
                          {t.disclaimerEn}
                        </div>
                      }
                      placement='bottom'
                      showArrow
                    >
                      <div className='text-ellipsis max-w-48 text-nowrap overflow-hidden'>{t.disclaimerEn}</div>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Button
                      onPress={() => {
                        handleEditClick(t)
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {selectedCategory && openUpdateModal && (
        <UpdateCategory
          categoryData={selectedCategory}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
          categoryId={selectedCategory._id}
          onUpdate={getData}
        />
      )}
    </>
  )
}

export default CategoriesList
