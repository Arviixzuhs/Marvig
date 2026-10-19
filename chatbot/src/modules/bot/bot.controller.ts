import { Request } from 'express'
import { AskQueryDto } from './dto/ask-query.dto'
import { MarvigAIService } from './bot.service'
import { Observable, from, mergeMap } from 'rxjs'
import { Controller, MessageEvent, Query, Req, Sse } from '@nestjs/common'

@Controller('bot-ai')
export class MarvigAIController {
  constructor(private readonly marvigAIService: MarvigAIService) {}

  @Sse('chat-stream')
  ask(@Req() req: Request, @Query() query: AskQueryDto): Observable<MessageEvent> {
    const { chatId, userMessage } = query

    const abort = new AbortController()
    req.res?.on('close', () => abort.abort())

    return from(
      this.marvigAIService.ask({
        user: req.user,
        chatId,
        userMessage,
        accessToken: req.cookies['accessToken'],
        signal: abort.signal,
      }),
    ).pipe(
      mergeMap(async function* (asyncGenerator) {
        for await (const chunk of asyncGenerator) {
          yield { data: JSON.stringify(chunk) }
        }
      }),
    )
  }
}
