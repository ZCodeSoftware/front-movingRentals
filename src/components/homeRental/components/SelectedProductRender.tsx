import { IProducts } from '../../../services/products/models/products.interface'
import { Card, CardBody, Image } from '@nextui-org/react'

const SelectedProductRender = ({ products }: { products: IProducts[] }) => {
  return (
    <>
      {products.length > 0 && (
        <div className=' overflow-y-auto max-h-52'>
          <h1>Productos seleccionados</h1>
          {products.map(p => (
            <Card className='m-2'>
              <CardBody className='flex flex-row justify-center items-center'>
                <Image src={p.image} width='200' />
                <div className='mx-2'>
                  <h1 className='font-bold'>{p.name}</h1>
                  <p>Engine: {p.specs?.engine}</p>
                  <p>Max speed: {p.specs?.maxSpeed}</p>
                  <p>Passengers: {p.specs?.passenger}</p>
                  <p>${p.price}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

export default SelectedProductRender
