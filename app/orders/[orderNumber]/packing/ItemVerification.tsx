import { useOrder, useOrderActions } from "@/store/orderSlice"
import ItemCard from "../shared/ItemCard"
import { Order } from "@/actions/orders/getOrder"
import { updateItemPackStatus } from "@/actions/orders/updateItemPackStatus"
import { completePacking } from "@/actions/orders/completePacking"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"


const ItemVerification = () => {

  const { order } = useOrder()
  const { setOrder, updateItemPackStatus: updatePackStatus } = useOrderActions()
  const t = useTranslations('orderPacking')
  const router = useRouter()



  const allPacked = order?.items.every(i => i.isPacked) ?? false

  const handleToggle = async (item: Order['items'][number]) => {
    const next = !item.isPacked
    updatePackStatus(item.id, next)
    await updateItemPackStatus(item.id, next)
  }

  const handleComplete = async () => {
    if (!order) return
    const updated = await completePacking(order.id)
    setOrder(updated)
    router.refresh()
  }
  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {order?.items.map(i => (
          <ItemCard
            key={i.id}
            item={i}
            completed={i.isPacked}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {allPacked && (
        <button
          onClick={handleComplete}
          className="btn btn-success btn-xl h-40 text-2xl"
        >
          {t('completePackingButton')}
        </button>
      )}

    </div>
  )
}

export default ItemVerification
