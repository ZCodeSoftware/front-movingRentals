import { useState, useEffect, useRef } from 'react'
import { Button, Card, Image } from '@nextui-org/react'
import { FaStar, FaStarHalf, FaRegStar } from 'react-icons/fa'
import { IimageSliderProps } from './models/image-slider-props.interface'
import chevronLeft from '../../assets/SVG/chevron-left.svg'
import chevronRight from '../../assets/SVG/chevron-right.svg'
import { Reviews } from '../../mocks/Reviews'
import { useTranslation } from 'react-i18next'

interface IReview {
  image: string
  name: string
  guide: string
  when: string
  review: string
  stars: string
}

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className='flex items-center gap-0.5 mb-2'>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className='w-4 h-4 text-yellow-400' />
      ))}
      {hasHalfStar && <FaStarHalf className='w-4 h-4 text-yellow-400' />}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className='w-4 h-4 text-yellow-400' />
      ))}
    </div>
  )
}

const ImageCarousel: React.FC<IimageSliderProps> = ({ className = '', autoplay = false, autoplayInterval = 3000 }) => {
  const [slides, setSlides] = useState<IReview[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (Reviews.length > 0) {
      setSlides(Reviews)
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px es el breakpoint típico para móviles
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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

  const goToPrevious = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => {
        const newIndex = prev === 0 ? slides.length - 1 : prev - 1
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
        return newIndex
      })
    }
  }

  const goToNext = () => {
    if (!isTransitioning) {
      setIsTransitioning(true)
      setCurrentIndex(prev => {
        const newIndex = prev === slides.length - 1 ? 0 : prev + 1
        setTimeout(() => {
          setIsTransitioning(false)
        }, 300)
        return newIndex
      })
    }
  }

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  if (!slides || slides.length === 0) {
    return <div className='text-center p-4'>No hay suficientes imágenes para mostrar</div>
  }

  const getVisibleSlides = () => {
    if (isMobile) {
      return [{ slide: slides[currentIndex], position: 0 }]
    }

    const visibleSlides = []
    for (let i = -1; i <= 1; i++) {
      let index = currentIndex + i
      if (index < 0) index = slides.length - 1
      if (index >= slides.length) index = 0
      visibleSlides.push({ slide: slides[index], position: i })
    }
    return visibleSlides
  }

  return (
    <Card
      className={`w-full sm:w-4/5 lg:w-3/4 mx-auto relative ${className} h-[400px] overflow-hidden`}
      onMouseEnter={autoplay ? handleMouseEnter : undefined}
      onMouseLeave={autoplay ? handleMouseLeave : undefined}
    >
      <h1 className='text-center font-semibold text-2xl p-2 h-2'>{t('Reviews.title')}</h1>
      <div className='relative h-full flex items-center justify-center'>
        <div className='absolute w-full h-full flex items-center justify-center'>
          {getVisibleSlides().map(({ slide, position }, index) => {
            const translateX = isMobile ? 0 : position * 100
            const scale = isMobile ? 1 : position === 0 ? 1.1 : 0.85
            const zIndex = position === 0 ? 10 : 5
            const opacity = position === 0 ? 1 : 0.7

            return (
              <div
                key={index}
                className={`absolute transition-all duration-300 ease-in-out top-20 
                  ${isMobile ? 'w-11/12' : 'w-1/3'} h-32 px-2`}
                style={{
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  zIndex,
                  opacity,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <div className='w-full bg-white rounded-lg overflow-hidden shadow-lg'>
                  <div
                    className={`flex flex-col justify-center relative ${
                      isMobile ? 'left-32' : 'left-48'
                    } aspect-video m-4 max-w-20`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.name || 'Review image'}
                      className='w-full h-full object-cover '
                    />
                  </div>
                  <div className='p-4'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>{slide.when}</p>
                      {Number(slide.stars) && <StarRating rating={Number(slide.stars)} />}
                    </div>
                    <p className='font-semibold'>{slide.name}</p>
                    <p className='text-sm text-gray-500'>{slide.guide}</p>
                    <p className='text-sm line-clamp-4 overflow-y-auto scroll-container'>{slide.review}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Button
          className='absolute -left-2 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white/90'
          onClick={goToPrevious}
          isIconOnly
        >
          <Image src={chevronLeft} alt='prev' />
        </Button>
        <Button
          className='absolute -right-2 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white/90'
          onClick={goToNext}
          isIconOnly
        >
          <Image src={chevronRight} alt='next' />
        </Button>
      </div>
    </Card>
  )
}

export default ImageCarousel
