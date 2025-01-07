import { useState, useEffect, useRef } from 'react'
import { Button, Card, Image } from '@nextui-org/react'
import { IimageSliderProps } from './models/image-slider-props.interface'
import chevronLeft from '../../assets/SVG/chevron-left.svg'
import chevronRight from '../../assets/SVG/chevron-right.svg'

const placeId = 'ChIJERvDPbnXT48RrkgXPfh8ESo'
const apiKey = 'YOUR_GOOGLE_API_KEY'

const ImageCarousel: React.FC<IimageSliderProps> = ({
  className = '',
  autoplay = false,
  autoplayInterval = 3000
}) => {
  const [reviews, setReviews] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const itemsToShow = window.innerWidth < 640 ? 2 : 3

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`)
        const data = await response.json()
        if (data.result && data.result.reviews) {
          setReviews(data.result.reviews)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [])

  useEffect(() => {
    if (autoplay && !isPaused && !isTransitioning) {
      autoplayTimeoutRef.current = setTimeout(() => {
        goToNext()
      }, autoplayInterval)
    }

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }
    }
  }, [currentIndex, autoplay, isPaused, isTransitioning, autoplayInterval])

  const handleTransitionEnd = () => {
    setIsTransitioning(false)

    if (currentIndex >= reviews.length - itemsToShow) {
      setCurrentIndex(itemsToShow)
    }

    if (currentIndex <= itemsToShow - 1) {
      setCurrentIndex(reviews.length - itemsToShow * 2)
    }
  }

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => prev - 1)
    }
  }

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  if (!reviews || reviews.length <= itemsToShow) {
    return <div className='text-center p-4'>No hay suficientes reseñas para mostrar</div>
  }

  const slideWidth = window.innerWidth < 640 ? 50 / itemsToShow : 40 / itemsToShow

  return (
    <Card
      className={`w-full mx-auto relative ${className}`}
      onMouseEnter={autoplay ? handleMouseEnter : undefined}
      onMouseLeave={autoplay ? handleMouseLeave : undefined}
    >
      <div className='relative overflow-hidden'>
        <div
          className={`flex relative ${isTransitioning ? 'transition-transform duration-300' : ''}`}
          style={{
            transform: `translateX(-${currentIndex * slideWidth}%)`,
            width: `${reviews.length * slideWidth}%`
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {reviews.map((review, index) => (
            <div key={index} className='relative flex-shrink-0 px-2' style={{ width: `${slideWidth}%` }}>
              <div className='aspect-video cursor-pointer'>
                <div className='w-full object-cover hover:opacity-90 transition-opacity'>
                  <p>{review.text}</p>
                  <p><strong>- {review.author_name}</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='absolute inset-y-0 left-0 flex items-center'>
          <Button className='h-full bg-white/40 hover:bg-white/90' onClick={goToPrevious} size='sm'>
            <Image src={chevronLeft} alt='prev' />
          </Button>
        </div>

        <div className='absolute inset-y-0 right-0 flex items-center'>
          <Button className='h-full bg-white/40 hover:bg-white/90' onClick={goToNext} size='sm'>
            <Image src={chevronRight} alt='next' />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default ImageCarousel