import { useState, useEffect, useRef } from 'react'
import { Button, Card, Image, Modal, ModalContent, ModalBody } from '@nextui-org/react'
import { IimageSliderProps, IImage } from './models/image-slider-props.interface'

const ImageCarousel: React.FC<IimageSliderProps> = ({
  images,
  className = '',
  autoplay = false,
  autoplayInterval = 3000
}) => {
  const [slides, setSlides] = useState<IImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const itemsToShow = window.innerWidth < 640 ? 2 : 3

  useEffect(() => {
    if (images.length > 0) {
      const lastItems = images.slice(-itemsToShow)
      const firstItems = images.slice(0, itemsToShow)
      setSlides([...lastItems, ...images, ...firstItems])
    }
  }, [images])

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

    if (currentIndex >= slides.length - itemsToShow) {
      setCurrentIndex(itemsToShow)
    }

    if (currentIndex <= itemsToShow - 1) {
      setCurrentIndex(slides.length - itemsToShow * 2)
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

  const handleImageClick = (image: IImage) => {
    setSelectedImage(image)
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  if (!slides || slides.length <= itemsToShow) {
    return <div className='text-center p-4'>No hay suficientes imágenes para mostrar</div>
  }

  const slideWidth = window.innerWidth < 640 ? 50 / itemsToShow : 40 / itemsToShow

  return (
    <>
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
              width: `${slides.length * slideWidth}%`
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((image, index) => (
              <div key={index} className='relative flex-shrink-0 px-2' style={{ width: `${slideWidth}%` }}>
                <div className='aspect-video cursor-pointer'>
                  <Image
                    src={image.src}
                    alt={image.alt || `Slide ${index}`}
                    className='w-full object-cover hover:opacity-90 transition-opacity'
                    radius='lg'
                    onClick={() => handleImageClick(image)}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className='absolute inset-y-0 left-0 flex items-center'>
            <Button className='ml-2 bg-white/80 hover:bg-white/90' onClick={goToPrevious} size='sm'>
              prev
            </Button>
          </div>

          <div className='absolute inset-y-0 right-0 flex items-center'>
            <Button className='mr-2 bg-white/80 hover:bg-white/90' onClick={goToNext} size='sm'>
              next
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        size='5xl'
        placement='center'
        scrollBehavior='inside'
      >
        <ModalContent>
          {onClose => (
            <ModalBody className='p-0'>
              {selectedImage && (
                <div className='relative'>
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt || 'Imagen ampliada'}
                    className='w-full object-contain max-h-[80vh]'
                  />
                  <Button className='absolute top-2 right-2 bg-white/80 hover:bg-white/90' size='sm' onClick={onClose}>
                    Cerrar
                  </Button>
                </div>
              )}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ImageCarousel
