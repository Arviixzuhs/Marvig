import { api } from '@/api/axios-client'

export interface FileUploadResponse {
  message: string
  fileUrl: string
}

export interface FilesUploadResponse {
  message: string
  fileUrls: string[]
}

export enum FileUploadVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export const fileService = {
  upload: async (
    formData: FormData,
    visibility?: FileUploadVisibility,
  ): Promise<FileUploadResponse> => {
    const { data } = await api.post<FileUploadResponse>('/file/upload', formData, {
      params: { visibility },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  },

  uploadFiles: async (
    formData: FormData,
    visibility?: FileUploadVisibility,
  ): Promise<FilesUploadResponse> => {
    const { data } = await api.post<FilesUploadResponse>('/file/uploads', formData, {
      params: { visibility },
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
