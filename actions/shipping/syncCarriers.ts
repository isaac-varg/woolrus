'use server'

import prisma from '@/lib/prisma'
import { shipstation } from '@/lib/shipstation'

export const syncCarriers = async () => {
  const { carriers } = await shipstation.getCarriers()

  const syncedAt = new Date()
  const seenCarrierIds: string[] = []

  for (const carrier of carriers) {
    seenCarrierIds.push(carrier.carrier_id)

    const dbCarrier = await prisma.shippingCarrier.upsert({
      where: { carrierId: carrier.carrier_id },
      create: {
        carrierId: carrier.carrier_id,
        carrierCode: carrier.carrier_code,
        nickname: carrier.nickname ?? carrier.friendly_name,
        friendlyName: carrier.friendly_name,
        primary: carrier.primary,
        syncedAt,
      },
      update: {
        carrierCode: carrier.carrier_code,
        nickname: carrier.nickname ?? carrier.friendly_name,
        friendlyName: carrier.friendly_name,
        primary: carrier.primary,
        syncedAt,
      },
    })

    const { services } = await shipstation.getCarrierServices(carrier.carrier_id)
    const seenServiceCodes: string[] = []

    for (const service of services) {
      seenServiceCodes.push(service.service_code)

      await prisma.carrierService.upsert({
        where: {
          carrierId_serviceCode: {
            carrierId: dbCarrier.id,
            serviceCode: service.service_code,
          },
        },
        create: {
          carrierId: dbCarrier.id,
          serviceCode: service.service_code,
          name: service.name,
          domestic: service.domestic,
          international: service.international,
        },
        update: {
          name: service.name,
          domestic: service.domestic,
          international: service.international,
        },
      })
    }

    // Delete services no longer in ShipStation
    await prisma.carrierService.deleteMany({
      where: {
        carrierId: dbCarrier.id,
        serviceCode: { notIn: seenServiceCodes },
      },
    })
  }

  // Delete carriers no longer in ShipStation
  await prisma.shippingCarrier.deleteMany({
    where: {
      carrierId: { notIn: seenCarrierIds },
    },
  })
}
