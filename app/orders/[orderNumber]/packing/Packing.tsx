'use client'
import { useState } from "react"
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import StepWizard from "@/components/ui/StepWizard"
import { LuBox, LuNotebookText } from "react-icons/lu"
import ItemVerification from "./ItemVerification"
import PackageManager from "./PackageManager"
import UnassignedItemsWarning from "./UnassignedItemsWarning"
import MissingWeightsWarning from "./MissingWeightsWarning"
import CompletePackingButton from "./CompletePackingButton"

const Packing = () => {
  const [step, setStep] = useState(0)

  return (
    <div className="flex flex-col gap-6">

      <Top />


      <UnassignedItemsWarning />
      <MissingWeightsWarning />

      <CompletePackingButton />

      <StepWizard
        steps={[
          {
            icon: LuNotebookText,
            label: "Verify"
          },
          {
            icon: LuBox,
            label: "Pack"
          }
        ]}
        currentStep={step}
        onStepChange={setStep}
      >
        <ItemVerification onNext={() => setStep(1)} />
        <PackageManager />
      </StepWizard>

    </div>
  )
}

export default Packing
