import { Check } from 'lucide-react'
import React from 'react'

interface IStepsProps {
  steps: string[]
  step: number
}

export const Steps = ({ steps, step }: IStepsProps) => {
  return (
    <div className='flex items-center justify-between w-full max-w-2xl mx-auto px-2'>
      {steps.map((s, i) => {
        const isCompleted = i + 1 < step
        const isActive = i + 1 === step

        return (
          <React.Fragment key={s}>
            {/* Contenedor del paso */}
            <div className='flex items-center gap-2 relative'>
              {/* Círculo numérico/Check */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                  isCompleted
                    ? 'bg-primary text-white'
                    : isActive
                      ? 'bg-foreground text-white'
                      : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>

              {/* Texto del paso: visible al lado en md+, oculto o adaptado en móvil si el espacio es crítico */}
              <span
                className={`text-xs sm:text-sm font-medium transition-colors hidden sm:inline-block ${
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}
              >
                {s}
              </span>
            </div>

            {/* Línea divisoria flexible */}
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-2 sm:mx-4 transition-colors ${
                  i + 1 < step ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
