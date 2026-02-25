'use client'
import { useRef } from "react"
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import PackageManager from "./PackageManager"
import UnverifiedItemsWarning from "./UnverifiedItemsWarning"
import CompleteQAButton from "./CompleteQAButton"
import Drawer, { type DrawerHandle } from "@/components/ui/Drawer"
import QADrawerContent from "./QADrawerContent"

const QA = () => {
  const drawerRef = useRef<DrawerHandle>(null)

  return (
    <div className="flex flex-col gap-6">

      <Top onToggleDrawer={() => drawerRef.current?.toggle()} />

      <UnverifiedItemsWarning />

      <CompleteQAButton />

      <PackageManager />

      <Drawer ref={drawerRef}>
        <QADrawerContent />
      </Drawer>

    </div>
  )
}

export default QA
