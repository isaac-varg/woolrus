'use server'

import prisma from "@/lib/prisma"
import { PickStatus } from "@/prisma/generated/enums"

export const updateItemPickStatus = async (itemId: string, status: PickStatus) => {
  return await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      pickStatus: status,
      pickedAt: status === PickStatus.PICKED ? new Date() : null,
    },
  })
}
