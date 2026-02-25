'use server'

import prisma from '@/lib/prisma'
import { shipstation } from '@/lib/shipstation'

export const purchaseLabelsForOrder = async (orderId: string) => {
  const packages = await prisma.package.findMany({
    where: { orderId },
    include: {
      shippingRates: { where: { isSelected: true } },
      shippingLabel: true,
    },
  })

  const trackingNumbers: string[] = []

  for (const pkg of packages) {
    // Skip if already has an active label
    if (pkg.shippingLabel && pkg.shippingLabel.status === 'active') {
      if (pkg.shippingLabel.trackingNumber) {
        trackingNumbers.push(pkg.shippingLabel.trackingNumber)
      }
      continue
    }

    const selectedRate = pkg.shippingRates[0]
    if (!selectedRate) {
      throw new Error(`No shipping rate selected for package ${pkg.id}`)
    }

    const labelResponse = await shipstation.purchaseLabelFromRate({
      rate_id: selectedRate.rateId,
      label_format: 'pdf',
    })

    await prisma.shippingLabel.create({
      data: {
        orderId,
        packageId: pkg.id,
        labelId: labelResponse.label_id,
        shipmentId: labelResponse.shipment_id,
        trackingNumber: labelResponse.tracking_number,
        carrierCode: labelResponse.carrier_code,
        serviceCode: labelResponse.service_code,
        shippingCost: labelResponse.shipment_cost.amount,
        currency: labelResponse.shipment_cost.currency,
        labelFormat: labelResponse.label_format,
        labelDownloadPdf: labelResponse.label_download.pdf,
        labelDownloadPng: labelResponse.label_download.png,
        shipDate: new Date(labelResponse.ship_date),
      },
    })

    if (labelResponse.tracking_number) {
      trackingNumbers.push(labelResponse.tracking_number)
    }
  }

  // Update workflow with tracking numbers
  if (trackingNumbers.length > 0) {
    await prisma.orderWorkflow.update({
      where: { orderId },
      data: { trackingNumber: trackingNumbers.join(', ') },
    })
  }
}
