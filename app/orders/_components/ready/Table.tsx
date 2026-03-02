'use client'
import { useRef, useState } from "react"
import { OrderWithItems } from "@/actions/orders/getOrders"
import { shipOrders } from "@/actions/shipping/shipOrders"
import { repackOrders } from "@/actions/orders/repackOrder"
import { formatDate } from "@/utils/date/formatDate"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const Table = ({ orders }: { orders: OrderWithItems[] }) => {
  const t = useTranslations('orders')
  const tt = useTranslations('orders.table')
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [shipping, setShipping] = useState(false)
  const [repacking, setRepacking] = useState(false)
  const repackDialogRef = useRef<HTMLDialogElement>(null)

  const allSelected = selected.size === orders.length && orders.length > 0

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(orders.map((o) => o.id)))
    }
  }

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleShip = async () => {
    const selectedIds = Array.from(selected)
    if (selectedIds.length === 0) return

    setShipping(true)
    try {
      const { results } = await shipOrders(selectedIds)

      // Open merged label PDF in new tab
      const labelUrl = `/api/shipping/labels?orders=${selectedIds.join(',')}`
      window.open(labelUrl, '_blank')

      // Alert on any per-order errors
      const errors = results.filter((r) => !r.success)
      if (errors.length > 0) {
        const messages = errors.map((e) => `#${e.orderNumber}: ${e.error}`)
        alert(`${t('shipErrors')}:\n\n${messages.join('\n')}`)
      }

      setSelected(new Set())
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setShipping(false)
    }
  }

  const confirmRepack = async () => {
    repackDialogRef.current?.close()
    const selectedIds = Array.from(selected)

    setRepacking(true)
    try {
      const { results } = await repackOrders(selectedIds)

      const errors = results.filter((r) => !r.success)
      if (errors.length > 0) {
        const messages = errors.map((e) => `#${e.orderNumber}: ${e.error}`)
        alert(messages.join('\n'))
      }

      setSelected(new Set())
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err))
    } finally {
      setRepacking(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          className="btn btn-primary"
          disabled={selected.size === 0 || shipping || repacking}
          onClick={handleShip}
        >
          {shipping ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              {t('shipping')}
            </>
          ) : (
            t('ship')
          )}
        </button>
        <button
          className="btn btn-warning"
          disabled={selected.size === 0 || shipping || repacking}
          onClick={() => repackDialogRef.current?.showModal()}
        >
          {repacking ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              {t('repacking')}
            </>
          ) : (
            t('repack')
          )}
        </button>
        {selected.size > 0 && (
          <span className="text-sm text-base-content/60">
            {t('selectedCount', { count: selected.size })}
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th>{tt('orderNumber')}</th>
              <th>{tt('customer')}</th>
              <th>{tt('items')}</th>
              <th>{tt('priority')}</th>
              <th>{tt('orderDate')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const priority = {
                badge: 'priority-high',
                label: tt('priorityHigh')
              }
              return (
                <tr
                  key={order.id}
                  onClick={() => router.push(`/orders/${order.orderNumber}?id=${order.id}`)}
                  className="hover:bg-accent/50 hover:cursor:pointer"
                >
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selected.has(order.id)}
                      onChange={() => toggleOne(order.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
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
      <dialog ref={repackDialogRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t('repack')}</h3>
          <p className="py-4">{t('repackConfirm')}</p>
          <div className="modal-action">
            <button className="btn" onClick={() => repackDialogRef.current?.close()}>
              {t('cancel')}
            </button>
            <button className="btn btn-warning" onClick={confirmRepack}>
              {t('repack')}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default Table
