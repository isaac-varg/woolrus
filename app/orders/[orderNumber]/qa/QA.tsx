'use client'
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import PackageManager from "./PackageManager"
import UnverifiedItemsWarning from "./UnverifiedItemsWarning"
import CompleteQAButton from "./CompleteQAButton"

const QA = () => {
  return (
    <div className="flex flex-col gap-6">

      <Top />

      <WorkflowHistory />

      <UnverifiedItemsWarning />

      <CompleteQAButton />

      <PackageManager />

    </div>
  )
}

export default QA
