import axios from 'axios'
import { IVehicleForm } from '../dashboardProducts/createProduct/models/vehicles-form.interface'
import { ITourForm } from '../dashboardProducts/createProduct/models/tour-form.interface'
import { ITransferForm } from '../dashboardProducts/createProduct/models/transfer-form.interface'
import { ICategoryForm } from '../dashboardCatalogs/createCatalogs/models/category-form.interface'

const uploadToCloudinary = async (
  file: Blob[],
  folderName: string,
  form: IVehicleForm | ITourForm | ITransferForm | ICategoryForm
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET

  try {
    const uploadedUrls = await Promise.all(
      file.map(async file => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', uploadPreset)
        formData.append('folder', `${folderName}/` + form.name)

        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data.secure_url
      })
    )

    return uploadedUrls
  } catch (error: any) {
    console.error('Error al subir imagenes', error)
    throw new Error('Error al subir imágenes')
  }
}

export default uploadToCloudinary
