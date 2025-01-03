import React, { useEffect, useState } from 'react'
import ImageCrop from './utils/ImageCrop'
import { IPreset } from './models/upload-image-preset.interface'
import { IVehicleForm } from '../dashboardProducts/createProduct/models/vehicles-form.interface'
import { ITourForm } from '../dashboardProducts/createProduct/models/tour-form.interface'
import { ITransferForm } from '../dashboardProducts/createProduct/models/transfer-form.interface'

interface CroppedFilesState {
  croppedImages: Blob[]
}

type FormTypes = IVehicleForm | ITourForm | ITransferForm

const UploadImage = <T extends FormTypes>({
  setUrl,
  form,
  handleMouseEnter,
  handleMouseLeave,
  imageFiles
}: IPreset<T>) => {
  const [isInputShow, setInputShow] = useState(false)
  const [croppingFiles, setCroppingFiles] = useState<File[]>([])
  const [croppedFiles, setCroppedFiles] = useState<CroppedFilesState>({
    croppedImages: []
  })

  const resizeImage = (file: File, maxDimension: number): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = event => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas'))
            return
          }

          const { width, height } = img
          const scaleFactor = Math.min(
            width > 1000 ? maxDimension / (width * 3) : maxDimension / width,
            maxDimension / height,
            1
          )
          const newWidth = Math.round(width * scaleFactor)
          const newHeight = Math.round(height * scaleFactor)

          canvas.width = newWidth
          canvas.height = newHeight

          ctx.drawImage(img, 0, 0, newWidth, newHeight)

          canvas.toBlob(
            blob => {
              if (blob) {
                const scaledFile = new File([blob], file.name, { type: file.type })
                resolve(scaledFile)
              } else {
                reject(new Error('No se pudo crear el Blob a partir del canvas'))
              }
            },
            file.type,
            0.9
          )
        }

        if (event.target?.result) {
          img.src = event.target.result as string
        }
      }

      reader.onerror = () => reject(new Error('Error al leer el archivo'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      const files = Array.from(e.target.files)

      const scaledFiles = await Promise.all(files.map(file => resizeImage(file, 1000)))

      setCroppingFiles(scaledFiles)
    }
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files)
      const scaledFiles = await Promise.all(files.map(file => resizeImage(file, 1000)))
      setCroppingFiles([...scaledFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (croppedFiles.croppedImages.length > 0) {
      setUrl(prev => [...prev, ...croppedFiles.croppedImages])
      setCroppedFiles({ croppedImages: [] })
    }
  }, [croppedFiles.croppedImages])

  const handleCropComplete = (croppedImages: Blob[]) => {
    setCroppedFiles(prevState => ({
      croppedImages: [...prevState.croppedImages, ...croppedImages]
    }))
    setCroppingFiles([])
  }

  const handleCropCancel = () => {
    setCroppingFiles([])
  }

  const handleImageChargeCancel = () => {
    setCroppedFiles({ croppedImages: [] })
    setUrl([])
    setInputShow(false)
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='w-full flex justify-center'>
      <button
        type='button'
        className={`bg-dymBlack text-dymAntiPop h-12 w-38 rounded-md border p-2 ${isInputShow && 'hidden'}`}
        onClick={() => setInputShow(!isInputShow)}
      >
        Cargar imágenes
      </button>
      {isInputShow && (
        <>
          {form.name ? (
            <div
              className='flex flex-col items-center justify-center w-full'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label
                htmlFor='dropzone-file'
                className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer'
              >
                <div className='flex flex-col items-center justify-center pt-5 pb-6 h-full'>
                  <svg
                    className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                    aria-hidden='true'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 20 16'
                  >
                    <path
                      stroke='currentColor'
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='2'
                      d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                    />
                  </svg>
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Click aqui para subir archivo</span> o arrastra aquí
                  </p>
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Selecciono {imageFiles.length} archivo/s</span>
                  </p>
                  <p className='mb-2 text-bold text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>Tamaño de imágen recomendado: 1000px X 1000px</span>
                  </p>
                </div>
                <input id='dropzone-file' type='file' className='hidden' onChange={handleFileChange} multiple />
                <div className='w-full h-20 cursor-default flex items-end justify-around bg-dymBlack p-2'>
                  <button
                    type='button'
                    onClick={handleImageChargeCancel}
                    className='bg-dymBlack text-dymAntiPop h-12 w-36 rounded-md border p-2'
                  >
                    Cancelar
                  </button>
                </div>
              </label>
            </div>
          ) : (
            <span className='text-red-600 text-xs block mt-1'>
              Debes agregar un nombre al producto antes de cargar imágenes
            </span>
          )}
        </>
      )}
      {croppingFiles.length > 0 ? (
        <ImageCrop files={croppingFiles} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
      ) : null}
    </div>
  )
}

export default UploadImage
