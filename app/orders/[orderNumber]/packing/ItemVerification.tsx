import { useOrder, useOrderActions } from "@/store/orderSlice"
import ItemCard from "../shared/ItemCard"
import { Order } from "@/actions/orders/getOrder"
import { updateItemPackStatus } from "@/actions/orders/updateItemPackStatus"
import { useTranslations } from "next-intl"

interface ItemVerificationProps {
  onNext: () => void
}

const ItemVerification = ({ onNext }: ItemVerificationProps) => {

  const { order } = useOrder()
  const { updateItemPackStatus: updatePackStatus } = useOrderActions()
  const t = useTranslations('orderPacking')

  const allPacked = order?.items.every(i => i.isPacked) ?? false

  const handleToggle = async (item: Order['items'][number]) => {
    const next = !item.isPacked
    updatePackStatus(item.id, next)
    await updateItemPackStatus(item.id, next)
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
          onClick={onNext}
          className="btn btn-success btn-xl h-40 text-2xl w-full"
        >
          {t('manageBoxesButton')}
        </button>
      )}

    </div>
  )
}

export default ItemVerification
