import { Prisma } from 'generated/prisma/client'

interface SerializationRetryOptions {
  maxAttempts?: number
  baseDelayMs?: number
  onExhausted?: () => Error
}

export const isSerializationError = (error: unknown): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034'

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export const withSerializationRetry = async <T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 50, onExhausted }: SerializationRetryOptions = {},
): Promise<T> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (!isSerializationError(error)) throw error

      if (attempt >= maxAttempts) {
        throw onExhausted ? onExhausted() : error
      }

      // Backoff con jitter para que los reintentos no vuelvan a chocar entre sí
      await sleep(baseDelayMs * attempt + Math.random() * baseDelayMs)
    }
  }
}
