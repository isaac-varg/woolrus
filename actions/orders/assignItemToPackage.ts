'use server'

import prisma from "@/lib/prisma"

export const assignItemToPackage = async (itemId: string, packageId: string) => {
  return await prisma.orderItem.update({
    where: { id: itemId },
    data: { packageId },
  })
}
