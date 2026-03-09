'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"

export const unvoidItem = async (orderItemId: string) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  await prisma.$transaction([
    prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        isVoided: false,
        voidedAt: null,
        voidedById: null,
        voidReason: null,
      },
    }),
    prisma.orderVoid.deleteMany({
      where: {
        orderItemId,
        isResolved: false,
      },
    }),
  ])
}
