import { marvigIA } from '@/api/axios-client'

import { paramsConstructor } from '@/utils/paramsConstructor'

export const marvigAIService = {
  getMessagesByChatId: (chatId: string, page: number, size: number) => {
    const params = paramsConstructor([
      { name: 'chatId', value: chatId },
      { name: 'page', value: page },
      { name: 'size', value: size },
    ])
    return marvigIA.get(`/messages/chat?${params}`)
  },
  getMyChats: () => marvigIA.get(`/chats/me`),
  createChat: (title: string) => marvigIA.post(`/chats`, { title }),
  deleteChat: (chatId: string) => marvigIA.delete(`/chats/${chatId}`),
  updateChatTitle: (chatId: string, title: string) => marvigIA.put(`/chats/${chatId}`, { title }),
}
