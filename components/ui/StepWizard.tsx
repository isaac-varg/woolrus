'use client'

import { Children, isValidElement } from 'react'
import StepTrack, { type StepConfig } from './StepTrack'

interface StepWizardProps {
  steps: StepConfig[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  // allow clicking past steps to navigate back/foward
  navigable?: boolean
}

const StepWizard = ({ steps, currentStep, onStepChange, children, navigable = true }: StepWizardProps) => {

  const panels = Children.toArray(children).filter(isValidElement)

  return (
    <div className="flex flex-col gap-8">
      <StepTrack
        steps={steps}
        currentStep={currentStep}
        onStepClick={navigable ? onStepChange : undefined}
      />
      <div>
        {panels[currentStep]}
      </div>
    </div>
  )
}

export default StepWizard
