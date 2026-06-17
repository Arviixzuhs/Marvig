import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

export enum AuthorType {
  USER = 'USER',
  CHATBOT = 'CHATBOT',
}

export interface MessageModel {
  id: string
  authorType: AuthorType
  content: string
  isTyping?: boolean
}

export interface ChatModel {
  id: string
  title: string
  userId: string
  cratedAt: string
  updatedAt: string
}

export interface ChatState {
  value: string
  myChats: ChatModel[]
  messages: MessageModel[]
  isLoading: boolean
  currentPage: number
  isOpenSidebar: boolean
  isLoadingMore: boolean
  pendingMessage: string | null
  hasMoreMessages: boolean
  shouldScrollToBottom: boolean
}

const initialState: ChatState = {
  value: '',
  myChats: [],
  messages: [],
  isLoading: false,
  currentPage: 1,
  isOpenSidebar: false,
  isLoadingMore: false,
  pendingMessage: null,
  hasMoreMessages: false,
  shouldScrollToBottom: false,
}

export const chatbotSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
    setMyChats: (state, action: PayloadAction<ChatModel[]>) => {
      state.myChats = action.payload
    },
    addChat: (state, action: PayloadAction<ChatModel>) => {
      state.myChats.unshift(action.payload)
    },
    setMessages: (state, action: PayloadAction<MessageModel[]>) => {
      state.messages = action.payload
    },
    addMessage: (state, action: PayloadAction<MessageModel>) => {
      state.messages.push(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setIsOpenSidebar: (state, action: PayloadAction<boolean>) => {
      state.isOpenSidebar = action.payload
    },
    setIsLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload
    },
    setPendingMessage: (state, action: PayloadAction<string | null>) => {
      state.pendingMessage = action.payload
    },
    setHasMoreMessages: (state, action: PayloadAction<boolean>) => {
      state.hasMoreMessages = action.payload
    },
    setShouldScrollToBottom: (state, action: PayloadAction<boolean>) => {
      state.shouldScrollToBottom = action.payload
    },
    updateChatTitle: (state, action: PayloadAction<{ newTitle: string; chatId: string }>) => {
      const { chatId, newTitle } = action.payload
      const chatIndex = state.myChats.findIndex((item) => item.id === chatId)
      if (chatIndex === -1) return

      state.myChats[chatIndex].title = newTitle
    },
    updateMessage: (
      state,
      action: PayloadAction<{ id: string; content: string; isTyping?: boolean }>,
    ) => {
      const { id, content, isTyping } = action.payload
      const msg = state.messages.find((m) => m.id === id)
      if (msg) {
        msg.content = content
        if (isTyping !== undefined) msg.isTyping = isTyping
      }
    },
    finishTypingMessage: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const msg = state.messages.find((m) => m.id === action.payload.id)
      if (msg) {
        msg.content = action.payload.content
        msg.isTyping = false
      }
    },
    setErrorMessage: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const msg = state.messages.find((m) => m.id === action.payload.id)
      if (msg) {
        msg.content = action.payload.error
        msg.isTyping = false
      }
    },
    resetChat: () => initialState,
  },
})

export const {
  setValue,
  setMyChats,
  addChat,
  setMessages,
  addMessage,
  updateChatTitle,
  setLoading,
  setCurrentPage,
  setIsOpenSidebar,
  setIsLoadingMore,
  setPendingMessage,
  setHasMoreMessages,
  setShouldScrollToBottom,
  updateMessage,
  finishTypingMessage,
  setErrorMessage,
  resetChat,
} = chatbotSlice.actions
