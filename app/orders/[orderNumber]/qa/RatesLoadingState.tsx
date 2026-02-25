'use client'

import { useOrder, useOrderActions } from '@/store/orderSlice'
import { refreshRates } from '@/actions/shipping/refreshRates'
import { getOrder } from '@/actions/orders/getOrder'
import { LuRefreshCw, LuInfo } from 'react-icons/lu'
import { useState } from 'react'

const RatesLoadingState = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const [loading, setLoading] = useState(false)

  const packages = order?.packages ?? []
  const hasAnyRates = packages.some(pkg => pkg.shippingRates.length > 0)

  if (hasAnyRates || packages.length === 0) return null

  const handleRefresh = async () => {
    if (!order) return
    setLoading(true)
    try {
      await refreshRates(order.id)
      const updated = await getOrder(order.id)
      setOrder(updated)
    } catch (err) {
      console.error('Failed to refresh rates:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="alert alert-info text-lg">
      <LuInfo className="size-6" />
      <span>Shipping rates are being fetched. If they don&apos;t appear shortly, try refreshing.</span>
      <button
        className="btn btn-sm btn-ghost"
        onClick={handleRefresh}
        disabled={loading}
      >
        <LuRefreshCw className={`size-5 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Refreshing...' : 'Refresh Rates'}
      </button>
    </div>
  )
}

export default RatesLoadingState
