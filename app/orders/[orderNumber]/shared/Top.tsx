'use client'

import { useOrder } from "@/store/orderSlice"
import { formatDate } from "@/utils/date/formatDate"
import { useRouter } from "next/navigation"
import { LuArrowLeft } from "react-icons/lu"
import { TbCalendarTime, TbUser, TbWorldPin } from "react-icons/tb"
import AddNoteDialog from "@/components/notes/AddNoteDialog"

type ShippingAddress = {
  state?: string
}

const Top = () => {
  const { order } = useOrder()
  const router = useRouter()

  const shipping = order?.shippingAddress as ShippingAddress | null

  return (
    <div className="flex justify-between">
      <div className="flex flex-col gap-8">

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <div className="text-4xl text-base-content font-semibold">{`Order #${order?.orderNumber}`}</div>
            {order?.id && <AddNoteDialog orderId={order.id} />}
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
        <div>
          <button className="btn btn-lg btn-outline" onClick={() => router.back()}>
            <LuArrowLeft className="size-8" />
            Back
          </button>
        </div>

      </div>

      {order?.workflowStatus}
    </div>
  )
}

export default Top
