import OpenAI from 'openai'
import { User } from '@/interfaces/user.interface'
import { config } from 'dotenv'
import { UserRole } from '@/models/UserModel'
import { AuthorType } from '@prisma/client'
import { ChatService } from '@/modules/chat/chat.service'
import { getFileContent } from '@/utils/getFileContent'
import { MessageService } from '@/modules/messages/messages.service'
import { apiTools, tools } from '@/tools'
import { setDynamicHeaders } from '@/api/apollo-client'
import { Injectable, Logger } from '@nestjs/common'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

config()

@Injectable()
export class MarvigAIService {
  private readonly logger = new Logger(MarvigAIService.name)
  private readonly ai = new OpenAI({
    baseURL: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': process.env.APP_URL,
      'X-Title': 'Marvig',
    },
  })
  private readonly model = process.env.OPENROUTER_MODEL
  private readonly MESSAGE_TO_SUMMARY = 8
  private readonly SHORT_CONTEXT_SIZE = 8
  private readonly MAX_LOOPS = 5

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  async ask({
    user,
    chatId,
    accessToken,
    userMessage,
    signal,
  }: {
    user: User
    chatId: string
    accessToken: string
    userMessage: string
    signal: AbortSignal
  }) {
    const decodedUserMessage = decodeURIComponent(userMessage)
    this.logger.log(`🚀 [ASK] ChatId: ${chatId} | Usuario: ${user.userId}`)

    const chat = await this.chatService.findBy(chatId, user.userId)
    const shortContext = await this.messageService.findLastContextMessages(
      chatId,
      this.SHORT_CONTEXT_SIZE,
    )

    const systemInstruction = await this.buildSystemInstruction(chat.summary, user.role)

    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemInstruction },
      ...shortContext.map(
        (m): ChatCompletionMessageParam => ({
          role: m.authorType === AuthorType.USER ? 'user' : 'assistant',
          content: m.content,
        }),
      ),
      { role: 'user', content: decodedUserMessage },
    ]

    setDynamicHeaders({ Authorization: `Bearer ${accessToken}` })

    await this.messageService.create({
      chatId,
      content: decodedUserMessage,
      authorType: AuthorType.USER,
    })

    this.handleSummary(chatId, chat.messageCount)

    return this.runAgent(chatId, messages, signal)
  }

  private async *runAgent(
    chatId: string,
    messages: ChatCompletionMessageParam[],
    signal: AbortSignal,
  ) {
    let fullText = ''

    try {
      for (let step = 1; step <= this.MAX_LOOPS; step++) {
        if (signal.aborted) break

        const isLastStep = step === this.MAX_LOOPS
        this.logger.log(`🤖 [AGENTE] Paso #${step}`)

        const stream = await this.ai.chat.completions.create(
          {
            model: this.model,
            messages,
            stream: true,
            temperature: 0.7,
            ...(isLastStep ? {} : { tools: apiTools, tool_choice: 'auto' as const }),
          },
          { signal },
        )

        let stepText = ''
        const calls = new Map<number, { id: string; name: string; args: string }>()
        let totalPromptTokens = 0
        let totalCompletionTokens = 0
        let totalCachedTokens = 0

        for await (const chunk of stream) {
          if (chunk.usage) {
            const usage = chunk.usage

            totalPromptTokens += usage.prompt_tokens ?? 0
            totalCompletionTokens += usage.completion_tokens ?? 0
            totalCachedTokens += usage.prompt_tokens_details?.cached_tokens ?? 0

            this.logger.log(
              `[TOKENS] Paso ${step} | ` +
                `Entrada: ${usage.prompt_tokens} | ` +
                `Salida: ${usage.completion_tokens} | ` +
                `Total: ${usage.total_tokens} | ` +
                `Cache: ${usage.prompt_tokens_details?.cached_tokens ?? 0}`,
            )
          }

          const delta = chunk.choices[0]?.delta
          if (!delta) continue

          if (delta.content) {
            stepText += delta.content
            fullText += delta.content
            yield delta.content
          }

          for (const tc of delta.tool_calls ?? []) {
            const current = calls.get(tc.index) ?? { id: '', name: '', args: '' }
            if (tc.id) current.id = tc.id
            if (tc.function?.name) current.name += tc.function.name
            if (tc.function?.arguments) current.args += tc.function.arguments
            calls.set(tc.index, current)
          }
        }

        if (signal.aborted || calls.size === 0) break

        const toolCalls = [...calls.values()].map((c, i) => ({
          id: c.id || `call_${step}_${i}`,
          name: c.name,
          args: c.args,
        }))

        messages.push({
          role: 'assistant',
          content: stepText || null,
          tool_calls: toolCalls.map((c) => ({
            id: c.id,
            type: 'function' as const,
            function: { name: c.name, arguments: c.args || '{}' },
          })),
        })

        for (const call of toolCalls) {
          if (signal.aborted) break // no ejecutar más tools si ya se canceló
          const result = await this.executeTool(call.name, call.args)
          messages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify(result),
          })
        }
      }
    } catch (error) {
      // El abort lanza una excepción: es esperada, cualquier otra se propaga
      if (!signal.aborted) throw error
      this.logger.log(`Petición cancelada por el usuario (chat ${chatId})`)
    } finally {
      // Se guarda lo generado hasta ahora, también si se canceló a la mitad
      if (fullText.trim()) {
        await this.messageService.create({
          chatId,
          content: fullText,
          authorType: AuthorType.CHATBOT,
        })
      }
    }

    if (!signal.aborted) yield '[DONE]'
  }

  private async executeTool(name: string, rawArgs: string): Promise<unknown> {
    const tool = tools.find((t) => t.name === name)
    if (!tool) {
      this.logger.error(`❌ Función no registrada: ${name}`)
      // Se devuelve al modelo en vez de lanzar excepción, para que pueda corregirse
      return { error: `Función no registrada: ${name}` }
    }

    try {
      const args = rawArgs ? JSON.parse(rawArgs) : {}
      this.logger.log(`✨ Ejecutando "${name}" con ${rawArgs}`)
      const result = await tool.execute(args)
      this.logger.log(`✅ Tool "${name}" OK`)
      return result ?? { ok: true }
    } catch (error: any) {
      this.logger.error(`❌ Falló la tool "${name}"`, error)
      return { error: error.message || 'Error interno de la herramienta' }
    }
  }

  private async handleSummary(chatId: string, messageCount: number) {
    const newCount = messageCount + 1
    if (newCount < this.MESSAGE_TO_SUMMARY) {
      await this.chatService.update(chatId, { messageCount: newCount })
      return
    }

    const summary = await this.generateSummary(chatId)
    await this.chatService.update(chatId, { summary, messageCount: 0 })
  }

  private async generateSummary(chatId: string) {
    const messages = await this.messageService.findLastContextMessages(chatId)
    const chatHistory = messages.map((m) => `${m.authorType}: ${m.content}`).join('\n')
    const systemInstruction = await getFileContent('skills/prompts/resume', 'SKILL.md')

    const response = await this.ai.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: `CONVERSACIÓN:\n${chatHistory}` },
      ],
      max_tokens: 150,
    })

    return response.choices[0]?.message?.content ?? ''
  }

  private basePrompt?: string

  private async buildSystemInstruction(summary: string, userRole: UserRole): Promise<string> {
    this.basePrompt ??= await getFileContent('skills/prompts/marvig', 'SKILL.md')

    const today = new Intl.DateTimeFormat('es-VE', {
      dateStyle: 'full',
      timeZone: 'America/Caracas',
    }).format(new Date())

    const sessionBlock = `<contexto_sesion>\nRol: ${userRole}\nFecha actual: ${today}\n</contexto_sesion>`

    const cleanSummary = this.sanitize(summary ?? '')
    const summaryBlock = cleanSummary
      ? `<resumen_conversacion_previa>\n${cleanSummary}\n</resumen_conversacion_previa>`
      : ''

    return [this.basePrompt, sessionBlock, summaryBlock].filter(Boolean).join('\n\n')
  }

  private sanitize(text: string): string {
    return text.replace(/<\/?(contexto_sesion|resumen_conversacion_previa)[^>]*>/gi, '').trim()
  }
}
