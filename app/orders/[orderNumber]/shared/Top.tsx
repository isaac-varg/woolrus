'use client'

import { useOrder } from "@/store/orderSlice"
import { formatDate } from "@/utils/date/formatDate"
import { useRouter } from "next/navigation"
import { LuArrowLeft, LuPanelRight } from "react-icons/lu"
import { TbCalendarTime, TbUser, TbWorldPin } from "react-icons/tb"
import AddNoteDialog from "@/components/notes/AddNoteDialog"
import NoteIndicator from "@/components/notes/NoteIndicator"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { useDrawerActions } from "@/store/drawerSlice"
import { useTranslations } from "next-intl"

type ShippingAddress = {
  state?: string
}

const statusBadge: Record<WorkflowStatus, string> = {
  PENDING: "badge-warning",
  PICKING: "badge-info",
  PACKING: "badge-primary",
  QA: "badge-secondary",
  COMPLETED: "badge-success",
  ON_HOLD: "badge-warning",
  CANCELLED: "badge-error",
}

const Top = () => {
  const { order } = useOrder()
  const router = useRouter()
  const { toggle } = useDrawerActions()
  const t = useTranslations('orderDetail')

  const shipping = order?.shippingAddress as ShippingAddress | null

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <div className="text-4xl text-base-content font-semibold">{t('orderNumber', { orderNumber: order?.orderNumber ?? '' })}</div>
            {order?.id && <AddNoteDialog orderId={order.id} />}
            <NoteIndicator count={order?.notes?.length ?? 0} />
          </div>

          <div className="flex gap-4">

            <div className="flex gap-2">
              <TbUser className="size-6 text-base-content" />
              <span className="text-base-content text-xl font-semibold">{order?.customerName}</span>
            </div>


            {shipping?.state && (

              <div className="flex gap-2">

                <TbWorldPin className="size-6 text-base-content" />
                <span className="text-base-content text-xl font-semibold">{shipping.state}</span>
              </div>
            )}

            {order?.wooCreatedAt && (
              <div className="flex gap-2">
                <TbCalendarTime className="size-6 text-base-content" />
                <span className="text-base-content text-xl font-semibold">{formatDate(order?.wooCreatedAt)}</span>
              </div>
            )}

          </div>
        </div>
        <div className="flex items-center justify-between ">
          <button className="btn btn-lg btn-outline" onClick={() => router.back()}>
            <LuArrowLeft className="size-8" />
            {t('back')}
          </button>
        </div>

      </div>

      <div className="flex flex-col gap-2 items-end">
        {order?.workflowStatus && (
          <div className={`badge ${statusBadge[order.workflowStatus]} badge-xl py-6 text-lg font-bold px-6 `}>
            {t(`status.${order.workflowStatus}`)}
          </div>
        )}
        <button className="btn btn-outline btn-secondary" onClick={toggle}>
          <LuPanelRight className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default Top
