'use client'
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import PackageManager from "./PackageManager"
import UnverifiedItemsWarning from "./UnverifiedItemsWarning"
import CompleteQAButton from "./CompleteQAButton"
import Drawer from "@/components/ui/Drawer"
import QADrawerContent from "./QADrawerContent"

const QA = () => {
  return (
    <div className="flex flex-col gap-6">

      <Top />

      <UnverifiedItemsWarning />

      <CompleteQAButton />

      <PackageManager />

      <Drawer>
        <QADrawerContent />
      </Drawer>

    </div>
  )
}

export default QA
