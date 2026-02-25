'use client'

import { Order } from '@/actions/orders/getOrder'
import { selectRate } from '@/actions/shipping/selectRate'
import { useOrder, useOrderActions } from '@/store/orderSlice'
import { LuTruck, LuClock, LuShieldCheck } from 'react-icons/lu'

type ShippingRate = Order['packages'][number]['shippingRates'][number]

type Props = {
  packageId: string
  rates: ShippingRate[]
}

const ShippingRateSelector = ({ packageId, rates }: Props) => {
  const { order } = useOrder()
  const { setOrder } = useOrderActions()

  if (rates.length === 0) {
    return (
      <div className="text-base text-base-content/50">
        No shipping rates available
      </div>
    )
  }

  const handleSelect = async (rate: ShippingRate) => {
    if (rate.isSelected) return
    await selectRate(rate.id, packageId)

    // Optimistically update local state
    if (order) {
      setOrder({
        ...order,
        packages: order.packages.map(pkg =>
          pkg.id === packageId
            ? {
                ...pkg,
                shippingRates: pkg.shippingRates.map(r => ({
                  ...r,
                  isSelected: r.id === rate.id,
                })),
              }
            : pkg,
        ),
      })
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold text-xl text-base-content">Shipping Rates</div>
      <div className="flex flex-col gap-2">
        {rates.map((rate, index) => (
          <div
            key={rate.id}
            onClick={() => handleSelect(rate)}
            className={`card shadow-sm cursor-pointer transition-all ${
              rate.isSelected
                ? 'border-2 border-primary bg-primary/10'
                : 'border-2 border-transparent bg-base-100 hover:bg-accent/50'
            }`}
          >
            <div className="card-body py-3 px-4 gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LuTruck className="size-5 text-primary" />
                  <span className="font-semibold text-lg text-base-content">
                    {rate.carrierName}
                  </span>
                  {index === 0 && (
                    <span className="badge badge-success badge-sm">Cheapest</span>
                  )}
                  {rate.guaranteedService && (
                    <LuShieldCheck className="size-4 text-success" title="Guaranteed" />
                  )}
                </div>
                <span className="font-bold text-xl text-base-content">
                  ${rate.shippingAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-base-content/60">
                <span>{rate.serviceType}</span>
                {rate.deliveryDays != null && (
                  <div className="flex items-center gap-1">
                    <LuClock className="size-4" />
                    <span>{rate.deliveryDays} day{rate.deliveryDays !== 1 && 's'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShippingRateSelector
