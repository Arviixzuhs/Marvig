export const buildFormData = (data: Record<string, any>, files?: FormData) => {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        // stringify arrays de objetos
        formData.append(key, JSON.stringify(value))
      } else {
        // arrays de primitivos
        value.forEach((v) => formData.append(`${key}[]`, String(v)))
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })

  if (files) {
    for (const [key, value] of files.entries()) {
      formData.append(key, value)
    }
  }

  return formData
}
