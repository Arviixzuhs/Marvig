import { api } from '@/api/axios-client'

export interface FileUploadResponse {
  message: string
  fileUrl: string
}

export interface FilesUploadResponse {
  message: string
  fileUrls: string[]
}

export const fileService = {
  upload: async (formData: FormData): Promise<FileUploadResponse> => {
    const { data } = await api.post<FileUploadResponse>('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  uploadFiles: async (formData: FormData): Promise<FilesUploadResponse> => {
    const { data } = await api.post<FilesUploadResponse>('/file/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
