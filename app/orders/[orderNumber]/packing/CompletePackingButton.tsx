import { useState } from "react"
import { useOrder, useOrderActions } from "@/store/orderSlice"
import { completePacking } from "@/actions/orders/completePacking"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

const CompletePackingButton = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()
  const t = useTranslations('orderPacking')
  const [loading, setLoading] = useState(false)

  const activeItems = order?.items.filter(i => !i.isVoided) ?? []
  const allAssigned = activeItems.length > 0 && activeItems.every(i => i.packageId)
  const allWeighed = order?.packages.length && order.packages.every(p => p.weight != null)

  if (!allAssigned || !allWeighed) return null

  const handleComplete = async () => {
    if (!order || loading) return
    setLoading(true)
    const updated = await completePacking(order.id)
    setOrder(updated)
    router.push('/orders?status=PACKING')
  }

  return (
    <button
      className="btn btn-xl btn-success h-40 text-2xl w-full"
      onClick={handleComplete}
      disabled={loading}
    >
      {loading ? <span className="loading loading-spinner" /> : t('completePacking')}
    </button>
  )
}

export default CompletePackingButton
