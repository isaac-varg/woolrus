'use client'

import Top from "../shared/Top"
import { useOrder } from "@/store/orderSlice"
import ReportIssueDialog from "@/components/quality/ReportIssueDialog"
import QualityIssueList from "@/components/quality/QualityIssueList"
import Drawer from "@/components/ui/Drawer"
import QADrawerContent from "../qa/QADrawerContent"
import { useTranslations } from "next-intl"

const Ready = () => {
  const { order } = useOrder()
  const t = useTranslations('qualityIssue')

  return (
    <div className="flex flex-col gap-6">

      <Top />

      {order && (
        <>
          <div className="flex flex-col gap-4">
            {order.packages.map((pkg, index) => (
              <div key={pkg.id} className="card card-bordered bg-base-100 shadow-sm">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Package {index + 1} — {pkg.box.name}</span>
                    {pkg.shippingLabel?.trackingNumber && (
                      <span className="text-sm text-base-content/60">{pkg.shippingLabel.trackingNumber}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ReportIssueDialog
            orderId={order.id}
            stageDiscovered={order.workflowStatus}
            isCustomerReported
          />

          <QualityIssueList issues={order.qualityIssues} />
        </>
      )}

      <Drawer>
        <QADrawerContent />
      </Drawer>

    </div>
  )
}

export default Ready
