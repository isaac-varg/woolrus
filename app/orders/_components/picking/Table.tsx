import { OrderWithItems } from "@/actions/orders/getOrders"
import { formatDate } from "@/utils/date/formatDate"
import { getTranslations } from "next-intl/server"

const Table = async ({ orders }: { orders: OrderWithItems[] }) => {
  const t = await getTranslations('orders.table')

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
