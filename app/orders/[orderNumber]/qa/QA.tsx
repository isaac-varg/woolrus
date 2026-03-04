'use client'
import Top from "../shared/Top"
import WorkflowHistory from "./WorkflowHistory"
import PackageManager from "./PackageManager"
import UnverifiedItemsWarning from "./UnverifiedItemsWarning"
import RatesLoadingState from "./RatesLoadingState"
import CompleteQAButton from "./CompleteQAButton"
import Drawer from "@/components/ui/Drawer"
import QADrawerContent from "./QADrawerContent"
import ReportIssueDialog from "@/components/quality/ReportIssueDialog"
import QualityIssueList from "@/components/quality/QualityIssueList"
import { useOrder } from "@/store/orderSlice"

const QA = () => {
  const { order } = useOrder()

  return (
    <div className="flex flex-col gap-6">

      <Top />

      <UnverifiedItemsWarning />

      <RatesLoadingState />

      <div className="flex items-center gap-2">
        <CompleteQAButton />
        {order && (
          <ReportIssueDialog orderId={order.id} stageDiscovered="QA" />
        )}
      </div>

      <PackageManager />

      {order && order.qualityIssues.length > 0 && (
        <QualityIssueList issues={order.qualityIssues} />
      )}

      <Drawer>
        <QADrawerContent />
      </Drawer>

    </div>
  )
}

export default QA
