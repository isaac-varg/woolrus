import { useOrder } from "@/store/orderSlice"
import { LuTriangleAlert } from "react-icons/lu"
import { useTranslations } from "next-intl"

const UnassignedItemsWarning = () => {
  const { order } = useOrder()
  const t = useTranslations('orderPacking')

  const unassignedCount = order?.items.filter(i => !i.packageId).length ?? 0

  if (unassignedCount === 0) return null

  return (
    <div className="alert alert-warning text-lg">
      <LuTriangleAlert className="size-6" />
      <span>{t('unassignedWarning', { count: unassignedCount })}</span>
    </div>
  )
}

export default UnassignedItemsWarning
