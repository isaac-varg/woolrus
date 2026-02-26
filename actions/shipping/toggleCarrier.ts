'use server'

import prisma from '@/lib/prisma'

export const toggleCarrier = async (id: string, enabled: boolean) => {
  await prisma.shippingCarrier.update({
    where: { id },
    data: { enabled },
  })
  await prisma.carrierService.updateMany({
    where: { carrierId: id },
    data: { enabled },
  })
}

export const toggleCarrierService = async (id: string, enabled: boolean) => {
  await prisma.carrierService.update({
    where: { id },
    data: { enabled },
  })
}
