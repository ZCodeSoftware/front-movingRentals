import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchVehicles } from '../../services/products/vehicles/GET/vehicles.get.service'
import { IVehicles } from '../../services/products/models/vehicles.interface'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, CardFooter, Image } from '@nextui-org/react'
import ProductDetailModal from './components/ProductDetailModal'

const ListByCategory = () => {
  const [data, setData] = useState<IVehicles[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [openModal, setOpenModal] = useState(false)
  const { id } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    const getData = async () => {
      if (id) {
        const result = await fetchVehicles(id)
        setData(result)
        setLoading(false)
      }
    }

    getData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {data.length > 0 ? (
        <main>
          <section className='w-full flex flex-col justify-center items-center p-4'>
            <h1 className='text-3xl text-center p-4'>{data[0].category.name}</h1>
            <p className='w-full md:w-2/4 border p-4'>{data[0].category.disclaimer}</p>
          </section>
          <section className='grid md:grid-cols-4 gap-4 p-4'>
            {data.map(p => (
              <div key={p._id}>
                <Card radius='none' className='rounded-xl' isPressable onPress={() => setOpenModal(true)}>
                  <CardHeader className='pb-0 py-2 px-4 flex-col items-start'>
                    <p className='font-extrabold'>{p.name}</p>
                  </CardHeader>
                  <CardBody>
                    <Image
                      alt='Test'
                      className='object-contain rounded-lg'
                      radius='none'
                      src={p.images[0]}
                      width='100%'
                      sizes='200px'
                    />
                  </CardBody>
                  <CardFooter className='w-full flex flex-row items-start justify-between px-3 text-nowrap'>
                    <div className='flex flex-col items-start '>
                      <h1 className='font-bold'>PRICE PER 24HR</h1>
                      <p>${p.price}</p>
                    </div>
                  </CardFooter>
                </Card>
                {openModal && <ProductDetailModal product={p} setOpenModal={setOpenModal} />}
              </div>
            ))}
          </section>
        </main>
      ) : (
        <h1>{t('listByCategory.not_products_available')}</h1>
      )}
    </>
  )
}

export default ListByCategory
