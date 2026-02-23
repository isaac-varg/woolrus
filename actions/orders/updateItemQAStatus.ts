'use server'

import prisma from "@/lib/prisma"

export const updateItemQAStatus = async (itemId: string, isQAVerified: boolean) => {
  await prisma.orderItem.update({
    where: { id: itemId },
    data: { isQAVerified },
  })
}
