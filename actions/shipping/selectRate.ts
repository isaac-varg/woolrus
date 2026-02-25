'use server'

import prisma from '@/lib/prisma'

export const selectRate = async (rateId: string, packageId: string) => {
  await prisma.$transaction([
    prisma.shippingRate.updateMany({
      where: { packageId },
      data: { isSelected: false },
    }),
    prisma.shippingRate.update({
      where: { id: rateId },
      data: { isSelected: true },
    }),
  ])
}
