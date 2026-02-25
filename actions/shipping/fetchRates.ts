'use server'

import prisma from '@/lib/prisma'
import {
  shipstation,
  getShipFromAddress,
  orderAddressToShipTo,
} from '@/lib/shipstation'
import type { RatePackage } from '@/lib/shipstation.types'

export const fetchRatesForOrder = async (orderId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      packages: { include: { box: true } },
    },
  })

  if (order.packages.length === 0) return

  const carriers = await shipstation.getCarriers()
  const carrierIds = carriers.carriers.map(c => c.carrier_id)
  if (carrierIds.length === 0) return

  const shipFrom = getShipFromAddress()
  const shipTo = orderAddressToShipTo(
    order.shippingAddress as Record<string, string>,
  )

  // Delete stale rates in a transaction before inserting new ones
  await prisma.shippingRate.deleteMany({
    where: { orderId },
  })

  for (const pkg of order.packages) {
    if (pkg.weight == null) continue

    const ratePackage: RatePackage = {
      weight: { value: pkg.weight, unit: 'pound' },
      dimensions: {
        length: pkg.box.length,
        width: pkg.box.width,
        height: pkg.box.height,
        unit: 'inch',
      },
    }

    const rateBody = {
      rate_options: { carrier_ids: carrierIds },
      shipment: {
        ship_from: shipFrom,
        ship_to: shipTo,
        packages: [ratePackage],
      },
    }
    const rateResponse = await shipstation.getRates(rateBody)
    const rates = rateResponse.rate_response?.rates ?? []

    if (rates.length === 0) continue

    // Sort by price to find cheapest
    const sorted = [...rates].sort(
      (a, b) => a.shipping_amount.amount - b.shipping_amount.amount,
    )

    await prisma.shippingRate.createMany({
      data: sorted.map((rate, index) => ({
        orderId,
        packageId: pkg.id,
        rateId: rate.rate_id,
        carrierId: rate.carrier_id,
        carrierCode: rate.carrier_code,
        carrierName: rate.carrier_friendly_name,
        serviceCode: rate.service_code,
        serviceType: rate.service_type,
        shippingAmount: rate.shipping_amount.amount,
        currency: rate.shipping_amount.currency,
        deliveryDays: rate.delivery_days,
        estimatedDeliveryDate: rate.estimated_delivery_date
          ? new Date(rate.estimated_delivery_date)
          : null,
        guaranteedService: rate.guaranteed_service,
        trackable: rate.trackable,
        isSelected: index === 0, // Auto-select cheapest
      })),
    })
  }
}
