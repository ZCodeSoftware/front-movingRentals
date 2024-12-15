import { Card, CardBody, Image } from '@nextui-org/react'

const SelectedProductRender = ({ products }: { products: any }) => {
  return (
    <>
      {products.length > 0 && (
        <div className=' overflow-y-auto max-h-52'>
          <h1>Productos seleccionados</h1>
          {products.map((p: any) => (
            <Card className='m-2'>
              <CardBody className='flex flex-row justify-center items-center'>
                <Image src={(p.image && p.image) || p.images[0]} width='200' />
                <div className='mx-2'>
                  <h1 className='font-bold'>{p.name}</h1>
                  <p>{p.description || ''}</p>
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
