import { useOrder, useOrderActions } from "@/store/orderSlice"
import { completeQA } from "@/actions/orders/completeQA"
import { useRouter } from "next/navigation"

const CompleteQAButton = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()

  const items = order?.items ?? []
  const packages = order?.packages ?? []

  const allVerified = packages.length > 0 && packages.every(pkg => {
    const pkgItems = items.filter(i => i.packageId === pkg.id)
    return pkgItems.length > 0 && pkgItems.every(i => i.isQAVerified)
  })

  if (!allVerified) return null

  const handleComplete = async () => {
    if (!order) return
    const updated = await completeQA(order.id)
    setOrder(updated)
    router.push('/orders?status=QA')
  }

  return (
    <button
      className="btn btn-xl btn-success h-40 text-2xl w-full"
      onClick={handleComplete}
    >
      Complete QA
    </button>
  )
}

export default CompleteQAButton
