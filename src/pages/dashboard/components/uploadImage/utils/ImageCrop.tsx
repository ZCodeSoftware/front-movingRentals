import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

interface ImageCropProps {
  files: File[]
  onCropComplete: (croppedImages: Blob[]) => void
  onCancel: () => void
}

const ImageCrop: React.FC<ImageCropProps> = ({ files, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [croppedImages, setCroppedImages] = useState<Blob[]>([])

  const onCropChange = (crop: any) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteCallback = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async (file: File, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(URL.createObjectURL(file))
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const canvasSize = 1000
    const maxWidth = 1000
    const maxHeight = 1000

    let width = pixelCrop.width
    let height = pixelCrop.height

    if (width > maxWidth || height > maxHeight) {
      const aspectRatio = width / height
      if (width > height) {
        width = maxWidth
        height = maxWidth / aspectRatio
      } else {
        height = maxHeight
        width = maxHeight * aspectRatio
      }
    }

    canvas.width = canvasSize
    canvas.height = canvasSize

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const xOffset = (canvasSize - width) / 2
    const yOffset = (canvasSize - height) / 2

    ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, xOffset, yOffset, width, height)

    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob!)
      }, 'image/jpeg')
    })
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(files[currentFileIndex], croppedAreaPixels)
      setCroppedImages([...croppedImages, croppedImage])
      if (currentFileIndex < files.length - 1) {
        setCurrentFileIndex(currentFileIndex + 1)
      } else {
        onCropComplete([...croppedImages, croppedImage])
      }
    } catch (error: any) {
      throw new Error(error)
    }
  }, [croppedAreaPixels, currentFileIndex, files, croppedImages, onCropComplete])

  const handleCancel = () => {
    if (currentFileIndex < files.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1)
    } else {
      onCancel()
    }
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50'>
      <div className='w-full h-screen flex flex-col justify-center items-center'>
        {files.length > 0 && (
          <div className='relative flex flex-col bg-white rounded-t-lg rounded-l-lg rounded-r-lg rounded-b-none shadow-lg p-4 h-3/4 w-2/4'>
            <div className='flex-grow'>
              <div className='m-4 h-full'>
                <Cropper
                  image={URL.createObjectURL(files[currentFileIndex])}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropCompleteCallback}
                />
              </div>
            </div>
          </div>
        )}
        <div className='rounded-b-lg p-2 flex justify-center space-x-2 bg-opacity-100 w-2/4 bg-buttonPrimary'>
          <button type='button' onClick={showCroppedImage} className='border border-black px-4 py-2 rounded'>
            Aceptar
          </button>
          <button type='button' onClick={handleCancel} className='text-black text-dymOrange px-4 py-2 rounded'>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCrop
