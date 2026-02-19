'use client'
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import StepWizard from "@/components/ui/StepWizard"
import { LuBox, LuNotebookText } from "react-icons/lu"
import ItemVerification from "./ItemVerification"

const Packing = () => {



  return (
    <div className="flex flex-col gap-6">

      <Top />

      <WorkflowHistory />

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

      >
        <ItemVerification />
      </StepWizard>


    </div>
  )
}

export default Packing
