'use server'

import prisma from '@/lib/prisma'
import {
  shipstation,
  getShipFromAddress,
  orderAddressToShipTo,
} from '@/lib/shipstation'
import type { RatePackage, RateRequest } from '@/lib/shipstation.types'

export const fetchRatesForOrder = async (orderId: string) => {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: {
      packages: { include: { box: true, items: true } },
    },
  })

  if (order.packages.length === 0) return

  const dbCarriers = await prisma.shippingCarrier.findMany({
    where: { enabled: true },
    include: { services: { where: { enabled: true } } },
  })
  const carrierIds = dbCarriers.map((c: { carrierId: string }) => c.carrierId)
  if (carrierIds.length === 0) return

  const enabledServiceCodes = new Set(
    dbCarriers.flatMap((c: { services: { serviceCode: string }[] }) =>
      c.services.map((s: { serviceCode: string }) => s.serviceCode),
    ),
  )

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

    // Create a ShipStation shipment (with sales order) if not already created
    let shipmentId = pkg.shipmentId
    if (!shipmentId) {
      const shipmentResponse = await shipstation.createShipment({
        shipments: [
          {
            ship_from: shipFrom,
            ship_to: shipTo,
            packages: [ratePackage],
            items: pkg.items.map(item => ({
              name: item.name,
              sku: item.sku ?? undefined,
              quantity: item.quantity,
              external_order_id: order.orderNumber,
              external_order_item_id: item.id,
            })),
            create_sales_order: true,
            validate_address: 'no_validation',
            external_order_id: order.orderNumber,
            external_shipment_id: pkg.id,
            order_source_code: 'woo_commerce',
          },
        ],
      })
      shipmentId = shipmentResponse.shipments[0].shipment_id
      await prisma.package.update({
        where: { id: pkg.id },
        data: { shipmentId },
      })
    }

    // Fetch rates using the existing shipment so the label stays linked to the sales order
    const rateBody: RateRequest = {
      rate_options: { carrier_ids: carrierIds },
      shipment_id: shipmentId,
    }
    const rateResponse = await shipstation.getRates(rateBody)
    const allRates = rateResponse.rate_response?.rates ?? []
    const rates = allRates.filter(r => enabledServiceCodes.has(r.service_code))

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
