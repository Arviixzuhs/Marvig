import { User } from '@/interfaces/user.interface'
import { config } from 'dotenv'
import { AuthorType } from '@prisma/client'
import { ChatService } from '@/modules/chat/chat.service'
import { getFileContent } from '@/utils/getFileContent'
import { MessageService } from '@/modules/messages/messages.service'
import { apiTools, tools } from '@/tools'
import { setDynamicHeaders } from '@/api/apollo-client'
import { GoogleGenAI, ContentListUnion } from '@google/genai'
import { ConflictException, Injectable, Logger } from '@nestjs/common'

config()

@Injectable()
export class MarvigAIService {
  private readonly logger = new Logger(MarvigAIService.name)
  private readonly ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  private readonly MESSAGE_TO_SUMMARY = 8
  private readonly SHORT_CONTEXT_SIZE = 8

  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  async ask({
    user,
    chatId,
    accessToken,
    userMessage,
  }: {
    user: User
    chatId: string
    accessToken: string
    userMessage: string
  }) {
    const decodedUserMessage = decodeURIComponent(userMessage)
    this.logger.log(`=========================================`)
    this.logger.log(`🚀 [ASK INICIADO] ChatId: ${chatId} | Usuario: ${user.userId}`)
    this.logger.log(`💬 Mensaje del usuario: "${decodedUserMessage}"`)

    const chat = await this.chatService.findBy(chatId, user.userId)

    const shortContext = await this.messageService.findLastContextMessages(
      chatId,
      this.SHORT_CONTEXT_SIZE,
    )
    this.logger.log(`📚 Contexto cargado: ${shortContext.length} mensajes previos encontrados.`)

    const contents: ContentListUnion = shortContext.map((m) => ({
      role: m.authorType === AuthorType.USER ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    contents.push({
      role: 'user',
      parts: [{ text: decodedUserMessage }],
    })

    const systemInstruction = await this.buildSystemInstruction(chat.summary)

    setDynamicHeaders({
      Authorization: `Bearer ${accessToken}`,
    })

    let loopCount = 0
    const MAX_LOOPS = 5

    while (loopCount < MAX_LOOPS) {
      loopCount++
      this.logger.log(`\n🤖 [BUCLE AGENTE] Paso #${loopCount} - Enviando contexto a Gemini...`)

      const response = await this.ai.models.generateContent({
        model: process.env['GEMINI_MODEL'],
        contents,
        config: {
          tools: apiTools,
          systemInstruction,
        },
      })

      const functionCalls = response.functionCalls

      if (!functionCalls || functionCalls.length === 0) {
        this.logger.log(
          `✨ [BUCLE AGENTE] El modelo decidió no usar herramientas en el paso #${loopCount}. Saliendo al stream final.`,
        )
        break
      }

      this.logger.warn(
        `🛠️ [TOOL CALL] Gemini solicitó ejecutar (${functionCalls.length}) herramienta(s):`,
      )

      contents.push(response.candidates[0].content)

      const functionResponses: any[] = []

      for (const call of functionCalls) {
        this.logger.log(`✨ Ejecutando: "${call.name}" | ID: ${call.id}`)
        this.logger.debug(`📦 Argumentos recibidos: ${JSON.stringify(call.args)}`)

        const tool = tools.find((t) => t.name === call.name)
        if (!tool) {
          this.logger.error(`❌ Función no registrada en el sistema: ${call.name}`)
          throw new ConflictException(`Función no registrada: ${call.name}`)
        }

        let result: unknown
        try {
          result = await tool.execute(call.args ?? {})
          this.logger.log(`✅ [SUCCESS] Tool "${call.name}" ejecutada con éxito.`)
          this.logger.debug(
            `📤 Resultado de la Tool: ${JSON.stringify(result).substring(0, 500)}...`,
          )
        } catch (error: any) {
          this.logger.error(`❌ [ERROR] Falló la ejecución de la tool "${call.name}":`, error)
          result = { error: error.message || 'Error interno de la herramienta' }
        }

        functionResponses.push({
          name: call.name,
          id: call.id,
          response: { result },
        })
      }

      contents.push({
        role: 'user',
        parts: functionResponses.map((fRes) => ({ functionResponse: fRes })),
      })
    }

    if (loopCount >= MAX_LOOPS) {
      this.logger.error(
        `⚠️ [GUARDRAIL] Se alcanzó el límite máximo de bucles (${MAX_LOOPS}). Rompiendo ciclo por seguridad.`,
      )
    }

    await this.messageService.create({
      chatId,
      content: decodedUserMessage,
      authorType: AuthorType.USER,
    })

    this.logger.log(
      `📝 Mensaje del usuario guardado en base de datos. Generando stream de respuesta...`,
    )

    this.handleSummary(chatId, chat.messageCount)

    return this.streamExplanation(chatId, contents, systemInstruction)
  }

  private async *streamExplanation(
    chatId: string,
    contents: ContentListUnion,
    systemInstruction: string,
  ) {
    const stream = await this.ai.models.generateContentStream({
      model: process.env['GEMINI_MODEL'],
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    })

    let fullText = ''

    for await (const chunk of stream) {
      const textChunk = chunk.text || ''
      if (textChunk) {
        fullText += textChunk
        yield textChunk
      }
    }

    await this.messageService.create({
      chatId,
      content: fullText,
      authorType: AuthorType.CHATBOT,
    })

    yield '[DONE]'
  }

  private async handleSummary(chatId: string, messageCount: number) {
    const newCount = messageCount + 1
    if (newCount < this.MESSAGE_TO_SUMMARY) {
      await this.chatService.update(chatId, { messageCount: newCount })
      return
    }

    const summary = await this.generateSummary(chatId)

    await this.chatService.update(chatId, {
      summary,
      messageCount: 0,
    })
  }

  private async generateSummary(chatId: string) {
    const messages = await this.messageService.findLastContextMessages(chatId)
    const chatHistory = messages.map((m) => `${m.authorType}: ${m.content}`).join('\n')
    const systemInstruction = await getFileContent('skills/prompts/resume', 'SKILL.md')

    const response = await this.ai.models.generateContent({
      model: process.env['GEMINI_MODEL'],
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nCONVERSACIÓN:\n${chatHistory}` }],
        },
      ],
      config: { maxOutputTokens: 150 },
    })

    return response.candidates[0].content.parts[0].text
  }

  private async buildSystemInstruction(summary: string): Promise<string> {
    const role = await getFileContent('skills/prompts/marvig', 'SKILL.md')
    return `${role}\n\n${summary}`.trim()
  }
}
