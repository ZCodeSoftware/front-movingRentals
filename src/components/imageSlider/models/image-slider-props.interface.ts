export interface IImage {
  src: string
  alt?: string
}

export interface IimageSliderProps {
  images: IImage[]
  className?: string
  autoplay: boolean
  autoplayInterval?: number
}
