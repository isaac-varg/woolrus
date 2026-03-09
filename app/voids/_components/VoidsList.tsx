'use client'

import { OrderWithVoids } from "@/actions/orders/getOrdersWithUnresolvedVoids"
import ResolveVoidDialog from "@/components/void/ResolveVoidDialog"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Props = {
  orders: OrderWithVoids[]
}

const VoidsList = ({ orders }: Props) => {
  const t = useTranslations('void')
  const tStatus = useTranslations('orderDetail.status')
  const router = useRouter()

  return (
    <div className="flex flex-col gap-6">
      {orders.map(order => (
        <div key={order.id} className="card bg-base-100 shadow-md">
          <div className="card-body gap-4">
            <div
              className="font-bold text-xl cursor-pointer hover:underline"
              onClick={() => router.push(`/orders/${order.orderNumber}?id=${order.id}`)}
            >
              {t('orderNumber', { orderNumber: order.orderNumber })} — {order.customerName}
            </div>

            <div className="flex flex-col gap-3">
              {order.orderVoids.map(v => (
                <div key={v.id} className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                  {v.orderItem.imageUrl && (
                    <Image
                      src={v.orderItem.imageUrl}
                      alt={v.orderItem.name}
                      width={48}
                      height={48}
                      className="rounded object-cover size-12"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{v.orderItem.name}</div>
                    {v.orderItem.sku && (
                      <div className="text-sm text-base-content/60">SKU: {v.orderItem.sku}</div>
                    )}
                    {v.reason && (
                      <div className="text-sm text-base-content/70 mt-1">{v.reason}</div>
                    )}
                  </div>
                  <div className="badge badge-outline">{tStatus(v.stageVoided)}</div>
                  <ResolveVoidDialog voidId={v.id} reason={v.reason} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VoidsList
