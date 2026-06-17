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

    const chat = await this.chatService.findBy(chatId, user.userId)

    // Obtener historial corto
    const shortContext = await this.messageService.findLastContextMessages(
      chatId,
      this.SHORT_CONTEXT_SIZE,
    )

    const contents: ContentListUnion = shortContext.map((m) => ({
      role: m.authorType === AuthorType.USER ? 'user' : 'model',
      parts: [{ text: m.content }],
    }))

    contents.push({
      role: 'user',
      parts: [{ text: decodedUserMessage }],
    })

    const systemInstruction = await this.buildSystemInstruction(chat.summary)

    const response = await this.ai.models.generateContent({
      model: process.env['GEMINI_MODEL'],
      contents,
      config: {
        tools: apiTools,
        maxOutputTokens: 400,
        systemInstruction,
      },
    })

    const functionCall = response.functionCalls?.[0]

    if (functionCall) {
      contents.push(response.candidates[0].content)

      const tool = tools.find((t) => t.name === functionCall.name)
      if (!tool) {
        throw new ConflictException(`Función no registrada: ${functionCall.name}`)
      }

      setDynamicHeaders({
        Authorization: `Bearer ${accessToken}`,
      })

      let result: unknown

      try {
        result = await tool.execute(functionCall.args ?? {})
      } catch (error) {
        this.logger.error(error)
      }

      contents.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: functionCall.name,
              response: {
                result,
              },
            },
          },
        ],
      })
    }

    // Guardar mensaje del usuario
    await this.messageService.create({
      chatId,
      content: decodedUserMessage,
      authorType: AuthorType.USER,
    })

    // Manejo de resumen asíncrono
    this.handleSummary(chatId, chat.messageCount)

    // Streaming final con la instrucción maestra
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
