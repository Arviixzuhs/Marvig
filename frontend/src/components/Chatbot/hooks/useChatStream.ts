import React from 'react'
import { useDispatch } from 'react-redux'
import { paramsConstructor } from '@/utils/paramsConstructor'
import {
  addMessage,
  AuthorType,
  setLoading,
  setErrorMessage,
  finishTypingMessage,
} from '@/features/chatbotSlice'
import type { StreamState } from '../types'

const FLUSH_INTERVAL_MS = 60

type FinishReason = 'done' | 'error' | 'cancel'

export const useChatStream = (scrollToBottom: () => void) => {
  const dispatch = useDispatch()

  const [stream, setStream] = React.useState<StreamState | null>(null)
  const [streamText, setStreamText] = React.useState('')

  const eventSourceRef = React.useRef<EventSource | null>(null)
  const bufferRef = React.useRef('')
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  // Permite finalizar el stream activo desde fuera (botón cancelar)
  const finishRef = React.useRef<((reason: FinishReason) => void) | null>(null)

  const scheduleFlush = React.useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      setStreamText(bufferRef.current)
      requestAnimationFrame(scrollToBottom)
    }, FLUSH_INTERVAL_MS)
  }, [scrollToBottom])

  const cancelFlush = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  React.useEffect(() => {
    return () => {
      eventSourceRef.current?.close()
      cancelFlush()
    }
  }, [cancelFlush])

  const cancel = React.useCallback(() => {
    finishRef.current?.('cancel')
  }, [])

  const sendMessage = React.useCallback(
    (messageContent: string, activeChatId: string) => {
      if (finishRef.current) return

      const userMsgId = Date.now().toString()
      const aiMsgId = String(Date.now() + 1)

      dispatch(addMessage({ id: userMsgId, authorType: AuthorType.USER, content: messageContent }))
      dispatch(
        addMessage({ id: aiMsgId, authorType: AuthorType.CHATBOT, content: '', isTyping: true }),
      )

      dispatch(setLoading(true))
      bufferRef.current = ''
      setStreamText('')
      setStream({ id: aiMsgId, started: false })
      requestAnimationFrame(scrollToBottom)

      const params = paramsConstructor([
        { name: 'userMessage', value: encodeURIComponent(messageContent) },
        { name: 'chatId', value: activeChatId },
      ])

      const eventSource = new EventSource(
        `${import.meta.env.VITE_CHATBOT_API}/bot-ai/chat-stream?${params}`,
        { withCredentials: true },
      )
      eventSourceRef.current = eventSource

      let finished = false
      let started = false

      const finishStream = (reason: FinishReason = 'done') => {
        if (finished) return
        finished = true
        finishRef.current = null

        eventSource.close() // el servidor detecta el cierre y aborta la petición al modelo
        cancelFlush()

        const fullResponse = bufferRef.current

        if (fullResponse) {
          // Con texto parcial se conserva lo generado, también al cancelar
          dispatch(finishTypingMessage({ id: aiMsgId, content: fullResponse }))
        } else if (reason === 'error') {
          dispatch(setErrorMessage({ id: aiMsgId, error: '❌ Error al obtener respuesta' }))
        } else if (reason === 'cancel') {
          dispatch(setErrorMessage({ id: aiMsgId, error: '⏹️ Respuesta cancelada' }))
        }

        setStream(null)
        dispatch(setLoading(false))
        requestAnimationFrame(scrollToBottom)
      }

      finishRef.current = finishStream

      eventSource.onmessage = (event) => {
        let chunk: string

        try {
          const parsed = JSON.parse(event.data)
          chunk = typeof parsed === 'string' ? parsed : (parsed?.content ?? '')
        } catch {
          chunk = event.data
        }

        if (chunk.trim() === '[DONE]') {
          finishStream('done')
          return
        }

        if (!chunk) return

        bufferRef.current += chunk

        if (!started) {
          started = true
          setStream({ id: aiMsgId, started: true })
        }

        scheduleFlush()
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        finishStream('error')
      }
    },
    [dispatch, scheduleFlush, cancelFlush, scrollToBottom],
  )

  return { stream, streamText, sendMessage, cancel }
}
