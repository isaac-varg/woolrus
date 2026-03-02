'use server'

import prisma from "@/lib/prisma"
import { getOrder } from "./getOrder"

export const deletePackage = async (packageId: string, orderId: string) => {
  await prisma.$transaction(async (tx) => {
    await tx.orderItem.updateMany({
      where: { packageId },
      data: { packageId: null },
    })

    await tx.package.delete({
      where: { id: packageId },
    })
  })

  return getOrder(orderId)
}
