import { useOrder, useOrderActions } from "@/store/orderSlice"
import { completePacking } from "@/actions/orders/completePacking"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

const CompletePackingButton = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()
  const t = useTranslations('orderPacking')

  const allAssigned = order?.items.length && order.items.every(i => i.packageId)
  const allWeighed = order?.packages.length && order.packages.every(p => p.weight != null)

  if (!allAssigned || !allWeighed) return null

  const handleComplete = async () => {
    if (!order) return
    const updated = await completePacking(order.id)
    setOrder(updated)
    router.push('/orders?status=PACKING')
    router.refresh()
  }

  return (
    <button
      className="btn btn-xl btn-success h-40 text-2xl w-full"
      onClick={handleComplete}
    >
      {t('completePacking')}
    </button>
  )
}

export default CompletePackingButton
