export const buildFormData = (files: FormData) => {
  const formData = new FormData()

  if (files) {
    for (const [key, value] of files.entries()) {
      formData.append(key, value)
    }
  }

  return formData
}
