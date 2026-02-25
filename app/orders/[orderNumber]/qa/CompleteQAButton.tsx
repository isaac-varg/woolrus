'use client'

import { useOrder, useOrderActions } from "@/store/orderSlice"
import { completeQA } from "@/actions/orders/completeQA"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LuLoader } from "react-icons/lu"

const CompleteQAButton = () => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const items = order?.items ?? []
  const packages = order?.packages ?? []

  const allVerified = packages.length > 0 && packages.every(pkg => {
    const pkgItems = items.filter(i => i.packageId === pkg.id)
    return pkgItems.length > 0 && pkgItems.every(i => i.isQAVerified)
  })

  const allRatesSelected = packages.length > 0 && packages.every(pkg =>
    pkg.shippingRates.some(r => r.isSelected)
  )

  if (!allVerified) return null

  const handleComplete = async () => {
    if (!order || loading) return
    setError(null)
    setLoading(true)
    try {
      const updated = await completeQA(order.id)
      setOrder(updated)
      router.push('/orders?status=QA')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase shipping labels. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="alert alert-error text-lg">
          <span>{error}</span>
        </div>
      )}
      <button
        className="btn btn-xl btn-success h-40 text-2xl w-full"
        onClick={handleComplete}
        disabled={!allRatesSelected || loading}
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <LuLoader className="size-8 animate-spin" />
            Purchasing Labels...
          </span>
        ) : !allRatesSelected ? (
          'Select Shipping Rate for All Packages'
        ) : (
          'Complete QA'
        )}
      </button>
    </div>
  )
}

export default CompleteQAButton
