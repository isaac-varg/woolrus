'use client'
import { useOrder, useOrderActions } from "@/store/orderSlice"
import Top from "../shared/Top"
import { useTranslations } from "next-intl"
import { updateOrderStatus } from "@/actions/orders/updateOrderStatus"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { useRouter } from "next/navigation"
import ItemCard from "../shared/ItemCard"



const Pending = () => {

  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const t = useTranslations('orderPending')
  const router = useRouter()

  const handleStart = async () => {
    if (!order) return
    const updated = await updateOrderStatus(order.id, WorkflowStatus.PICKING)
    setOrder(updated)
    router.refresh()
  }

  return (

    <div className="flex flex-col gap-6">
      <Top />


      <button className="btn btn-xl btn-primary h-40" onClick={handleStart}>
        <span>{t("startButton")}</span>
      </button>



      <div className="grid grid-cols-2 gap-6">
        {order?.items.map(i => <ItemCard key={i.id} item={i} />)}
      </div>

    </div>

  )
}

export default Pending
