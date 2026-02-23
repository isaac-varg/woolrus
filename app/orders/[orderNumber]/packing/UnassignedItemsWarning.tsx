import { useOrder } from "@/store/orderSlice"
import { LuTriangleAlert } from "react-icons/lu"

const UnassignedItemsWarning = () => {
  const { order } = useOrder()

  const unassignedCount = order?.items.filter(i => !i.packageId).length ?? 0

  if (unassignedCount === 0) return null

  return (
    <div className="alert alert-warning text-lg">
      <LuTriangleAlert className="size-6" />
      <span>
        <strong>{unassignedCount}</strong> {unassignedCount === 1 ? 'item has' : 'items have'} not been assigned to a package.
      </span>
    </div>
  )
}

export default UnassignedItemsWarning
