'use server'

import prisma from "@/lib/prisma"

export const updateItemPackStatus = async (itemId: string, isPacked: boolean) => {
  return await prisma.orderItem.update({
    where: { id: itemId },
    data: { isPacked },
  })
}
