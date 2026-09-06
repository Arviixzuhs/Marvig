import React from 'react'

import { VerificationCodeType } from '@/models/VerificationCodeModel'

const PIN_COOLDOWN_CONFIG: Record<VerificationCodeType, number> = {
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hora
  VERIFY_EMAIL: 60 * 1000, // 1 minuto
}

type CodeCooldownContextType = {
  canResend: (codeType: VerificationCodeType) => boolean
  timeLeft: (codeType: VerificationCodeType) => string
  markCodeCreated: (codeType: VerificationCodeType) => void
}

const CodeCooldownContext = React.createContext<CodeCooldownContextType | undefined>(undefined)

export function CodeCooldownProvider({ children }: { children: React.ReactNode }) {
  const [secondsLeftByType, setSecondsLeftByType] = React.useState<Record<string, number>>({})

  function formatTimeLeft(seconds: number): string {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m ${secs}s`
    return `${secs}s`
  }

  React.useEffect(() => {
    const updateCounters = () => {
      const newSecondsLeft: Record<string, number> = {}

      Object.keys(PIN_COOLDOWN_CONFIG).forEach((type) => {
        const key = `codeCreatedAt:${type}`
        const createdAtRaw = localStorage.getItem(key)

        if (createdAtRaw) {
          const createdAt = new Date(createdAtRaw).getTime()
          const cooldownMs = PIN_COOLDOWN_CONFIG[type as VerificationCodeType]
          const expiry = createdAt + cooldownMs
          const remaining = Math.max(0, Math.floor((expiry - Date.now()) / 1000))

          if (remaining > 0) {
            newSecondsLeft[type] = remaining
          } else {
            localStorage.removeItem(key)
          }
        }
      })

      setSecondsLeftByType(newSecondsLeft)
    }

    updateCounters()
    const interval = setInterval(updateCounters, 1000)

    return () => clearInterval(interval)
  }, [])

  const canResend = (codeType: VerificationCodeType) => {
    const seconds = secondsLeftByType[codeType] || 0
    return seconds <= 0
  }

  const markCodeCreated = (codeType: VerificationCodeType) => {
    if (!canResend(codeType)) return

    const now = new Date().toISOString()
    localStorage.setItem(`codeCreatedAt:${codeType}`, now)

    setSecondsLeftByType((prev) => ({
      ...prev,
      [codeType]: Math.ceil(PIN_COOLDOWN_CONFIG[codeType] / 1000),
    }))
  }

  const timeLeft = (codeType: VerificationCodeType) => {
    const seconds = secondsLeftByType[codeType] || 0
    return formatTimeLeft(seconds)
  }

  return (
    <CodeCooldownContext.Provider value={{ canResend, timeLeft, markCodeCreated }}>
      {children}
    </CodeCooldownContext.Provider>
  )
}

export function useCodeCooldownContext() {
  const context = React.useContext(CodeCooldownContext)
  if (!context) {
    throw new Error('useCodeCooldownContext debe usarse dentro de un CodeCooldownProvider')
  }
  return context
}