import { useOrder, useOrderActions } from "@/store/orderSlice"
import { completePacking } from "@/actions/orders/completePacking"
import { useRouter } from "next/navigation"

const CompletePackingButton = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()

  const allAssigned = order?.items.length && order.items.every(i => i.packageId)
  const allWeighed = order?.packages.length && order.packages.every(p => p.weight != null)

  if (!allAssigned || !allWeighed) return null

  const handleComplete = async () => {
    if (!order) return
    const updated = await completePacking(order.id)
    setOrder(updated)
    router.push('/orders?status=PACKING')
  }

  return (
    <button
      className="btn btn-xl btn-success h-40 text-2xl w-full"
      onClick={handleComplete}
    >
      Complete Packing
    </button>
  )
}

export default CompletePackingButton
