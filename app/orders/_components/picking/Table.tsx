import { Order } from "@/actions/orders/getOrder"
import { OrderWithItems } from "@/actions/orders/getOrders"
import { formatDate } from "@/utils/date/formatDate"

const Table = ({ orders }: { orders: OrderWithItems[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Priority</th>
            <th>Order Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const priority = {
              badge: 'priority-high',
              label: 'High'
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
