const uploadToCloudinary = async (file: File): Promise<string | null> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_CLOUD_PRESET

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error al subir imagen', error)
    return null
  }
}

export default uploadToCloudinary
