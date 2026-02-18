'use client'

import { useOrder, useOrderActions } from "@/store/orderSlice"
import ItemCard from "../shared/ItemCard"
import { updateItemPickStatus } from "@/actions/orders/updateItemPickStatus"
import { PickStatus } from "@/prisma/generated/enums"
import { Order } from "@/actions/orders/getOrder"

const ItemsGrid = () => {

  const { order } = useOrder()
  const { updateItemPickStatus: updateLocal } = useOrderActions()

  const handleToggle = async (item: Order['items'][number]) => {
    const next = item.pickStatus === PickStatus.PICKED ? PickStatus.PENDING : PickStatus.PICKED
    updateLocal(item.id, next)
    await updateItemPickStatus(item.id, next)
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {order?.items.map(i => (
        <ItemCard
          key={i.id}
          item={i}
          completed={i.pickStatus === PickStatus.PICKED}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}

export default ItemsGrid
