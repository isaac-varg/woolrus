'use client'

import { useOrder, useOrderActions } from "@/store/orderSlice"
import { PickStatus, WorkflowStatus } from "@/prisma/generated/enums"
import { updateOrderStatus } from "@/actions/orders/updateOrderStatus"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

const CompletionButtons = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()
  const t = useTranslations('orderPicking')

  const allPicked = order?.items.length && order.items.every(i => i.pickStatus === PickStatus.PICKED)

  if (!allPicked) return null

  const handleCompleteToPending = async () => {
    if (!order) return
    const updated = await updateOrderStatus(order.id, WorkflowStatus.PACKING)
    setOrder(updated)
    router.push('/orders?status=PENDING')
  }

  const handleCompleteToPacking = async () => {
    if (!order) return
    const updated = await updateOrderStatus(order.id, WorkflowStatus.PACKING)
    setOrder(updated)
    router.refresh()
  }

  return (
    <div className="flex gap-6">
      <button
        className="btn btn-xl btn-outline h-40 flex-1"
        onClick={handleCompleteToPending}
      >
        {t('completeToPending')}
      </button>
      <button
        className="btn btn-xl btn-primary h-40 flex-1"
        onClick={handleCompleteToPacking}
      >
        {t('completeToPacking')}
      </button>
    </div>
  )
}

export default CompletionButtons
