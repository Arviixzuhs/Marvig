import React from 'react'
import { Steps } from './components/Steps'
import { Button, Form } from '@heroui/react'

export interface StepItem {
  label: string
  component: React.ReactNode
}

interface StepperProps {
  items: StepItem[]
  currentStep: number
  onStepChange: (step: number) => void
  submitButtonText?: string
  isLoading?: boolean
  onFinalSubmit?: () => void
  showSecondaryButton?: boolean
  secondaryButtonText?: string
  onSecondaryAction?: () => void
}

export const Stepper: React.FC<StepperProps> = ({
  items,
  currentStep,
  onStepChange,
  submitButtonText = 'Continuar',
  onFinalSubmit,
  isLoading = false,
  showSecondaryButton = false,
  secondaryButtonText = 'Atrás',
  onSecondaryAction,
}) => {
  const totalSteps = items.length
  const activeItem = items[currentStep - 1]

  const isLastStep = currentStep === totalSteps
  const isSubmitStep = currentStep === totalSteps - 1

  const handleNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (currentStep < totalSteps - 1) {
      onStepChange(currentStep + 1)
    } else if (isSubmitStep && onFinalSubmit) {
      onFinalSubmit()
    }
  }

  const stepLabels = items.map((item) => item.label)

  return (
    <div className='w-full'>
      <Form onSubmit={handleNext} className='w-full flex flex-col gap-6'>
        <Steps steps={stepLabels} step={currentStep} />
        <div className='w-full '>{activeItem ? activeItem.component : null}</div>
        {!isLastStep && (
          <div className='flex flex-col sm:flex-row gap-3 w-full mt-2'>
            {showSecondaryButton && currentStep > 1 && (
              <Button
                type='button'
                variant='flat'
                className='w-full'
                onPress={onSecondaryAction || (() => onStepChange(currentStep - 1))}
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button color='primary' type='submit' className='w-full' isLoading={isLoading}>
              {isSubmitStep ? submitButtonText : 'Continuar'}
            </Button>
          </div>
        )}
      </Form>
    </div>
  )
}
