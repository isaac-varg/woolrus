'use client'

import { useState, Children, isValidElement } from 'react'
import StepTrack, { type StepConfig } from './StepTrack'

interface StepWizardProps {
  steps: StepConfig[]
  children: React.ReactNode
  // allow clicking past steps to navigate back/foward  
  navigable?: boolean
}

const StepWizard = ({ steps, children, navigable = true }: StepWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0)

  const panels = Children.toArray(children).filter(isValidElement)

  return (
    <div className="flex flex-col gap-8">
      <StepTrack
        steps={steps}
        currentStep={currentStep}
        onStepClick={navigable ? setCurrentStep : undefined}
      />
      <div>
        {panels[currentStep]}
      </div>
    </div>
  )
}

export default StepWizard
