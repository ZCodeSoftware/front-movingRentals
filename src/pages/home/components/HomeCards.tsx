import { Card, CardFooter, Image } from '@nextui-org/react'
import { Link } from 'react-router-dom'

interface Item {
  _id: string
  name: string
  image: string
}

interface HomeCardsProps {
  items: Item[]
}

const HomeCards = ({ items }: HomeCardsProps) => {
  return (
    <div className='flex space-x-4 overflow-x-auto md:overflow-visible w-full md:justify-center'>
      {items.length > 0 ? (
        items.map(i => (
          <Card key={i._id} className='flex-none w-72 mx-2'>
            <Link to={`/list-by-category/${i._id}`}>
              <Card radius='none' className='h-full' isPressable>
                <Image alt={i.name} sizes='200px' className=' object-cover' radius='none' src={i.image} width='100%' />
                <CardFooter className='justify-center before:bg-white/10 bg-gray-400 bg-opacity-30 border-white/80 border-1 overflow-hidden absolute before:rounded-xl bottom-0 w-full shadow-small z-10'>
                  <p className='text-white/80 font-black'>{i.name}</p>
                </CardFooter>
              </Card>
            </Link>
          </Card>
        ))
      ) : (
        <p>No items available</p>
      )}
    </div>
  )
}

export default HomeCards
