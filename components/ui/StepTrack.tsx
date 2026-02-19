'use client'

import type { IconType } from "react-icons";

export interface StepConfig {
  label: string
  icon: IconType
}

interface StepTrackProps {
  steps: StepConfig[]
  currentStep: number
  //optional but when  provided, past steps become clickable
  onStepClick?: (index: number) => void
}

const StepTrack = ({ steps, currentStep, onStepClick }: StepTrackProps) => {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => {
        const isPast = index < currentStep
        const isActive = index === currentStep
        const isClickable = isPast && !!onStepClick

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step node */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              aria-current={isActive ? 'step' : undefined}
              className={[
                'flex flex-col items-center gap-1.5',
                isClickable ? 'cursor-pointer' : 'cursor-default',
              ].join(' ')}
            >
              <div
                className={[
                  'flex items-center justify-center size-12 p-2  rounded-full border-2 transition-colors',
                  isPast
                    ? 'bg-primary border-primary text-primary-content'
                    : isActive
                      ? 'border-primary text-primary bg-base-100'
                      : 'border-base-300 text-base-content/40 bg-base-100',
                ].join(' ')}
              >
                <step.icon className="size-8" />
              </div>
              <span
                className={[
                  'text-xl font-semibold whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-primary'
                    : isPast
                      ? 'text-base-content/70'
                      : 'text-base-content/40',
                ].join(' ')}
              >
                {step.label}
              </span>
            </button>

            {/* Connector — hidden after last step */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mb-5 bg-base-300 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: isPast ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default StepTrack
