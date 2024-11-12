import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProducts } from '../../services/products/productsService'
import { IProducts } from '../../services/products/models/products.interface'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, CardFooter, Image } from '@nextui-org/react'

const ListByCategory = () => {
  const [data, setData] = useState<IProducts[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { id } = useParams()
  const { t } = useTranslation()

  useEffect(() => {
    const getData = async () => {
      if (id) {
        const result = await fetchProducts(id)
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
            <p className='w-full md:w-2/4 border p-4'>
              A security deposit is required for each and every rental. The deposit is kept in a safe at our office. You
              will get your deposit back when you return the vehicle.
            </p>
          </section>
          <section className='flex flex-wrap'>
            {data.map(p => (
              <div className='p-2 w-full sm:w-1/2 md:w-1/3' key={p._id}>
                <Card radius='none' className='h-full w-full' isPressable>
                  <CardHeader className='pb-0 py-2 px-4 flex-col items-start border'>
                    <p className=' font-black'>{p.name}</p>
                  </CardHeader>
                  <CardBody className='py-2'>
                    <Image
                      alt='Test'
                      className=' h-[300px] md:h-[600px] object-contain'
                      radius='none'
                      src={p.image}
                      width='100%'
                    />
                  </CardBody>
                  <CardFooter className='flex justify-center items-center border px-4 py-0'>
                    <div className='w-2/4 h-full flex flex-col items-start text-left p-2'>
                      <h1 className='font-bold'>Specs</h1>
                      <p>Engine: {p.specs?.engine}</p>
                      <p>Max speed: {p.specs?.maxSpeed}</p>
                      <p>Passenger capacity: {p.specs?.passenger}</p>
                    </div>
                    <div className='w-2/4 h-full flex flex-col items-start text-left p-2'>
                      <h1 className='font-bold'>PRICE PER 24HR</h1>
                      <p>${p.price}</p>
                    </div>
                  </CardFooter>
                </Card>
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
