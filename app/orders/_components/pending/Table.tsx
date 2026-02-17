'use client'
import { OrderWithItems } from "@/actions/orders/getOrders"
import { formatDate } from "@/utils/date/formatDate"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

const Table = ({ orders }: { orders: OrderWithItems[] }) => {

  const router = useRouter()
  const t = useTranslations('orders.table')

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>{t('orderNumber')}</th>
            <th>{t('customer')}</th>
            <th>{t('items')}</th>
            <th>{t('priority')}</th>
            <th>{t('orderDate')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const priority = {
              badge: 'priority-high',
              label: t('priorityHigh')
            }
            return (
              <tr
                key={order.id}
                className="hover:bg-accent/50 hover:cursor:pointer"
                onClick={() => router.push(`/orders/${order.orderNumber}?id=${order.id}`)}
              >
                <td className="font-mono">{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.items.length}</td>
                <td>
                  <span className={`badge badge-sm ${priority.badge}`}>
                    {priority.label}
                  </span>
                </td>
                <td>{formatDate(order.wooCreatedAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

  )
}

export default Table
