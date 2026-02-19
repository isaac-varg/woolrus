'use server'

import prisma from "@/lib/prisma"

export const removeItemFromPackage = async (itemId: string) => {
  return await prisma.orderItem.update({
    where: { id: itemId },
    data: { packageId: null },
  })
}
