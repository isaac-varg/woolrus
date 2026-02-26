'use server'

import prisma from '@/lib/prisma'

const _getCarriers = () =>
  prisma.shippingCarrier.findMany({
    include: { services: true },
    orderBy: { friendlyName: 'asc' },
  })

export type ShippingCarrierWithServices = Awaited<ReturnType<typeof _getCarriers>>[number]

export const getShippingCarriers = async (): Promise<ShippingCarrierWithServices[]> => {
  return _getCarriers()
}
