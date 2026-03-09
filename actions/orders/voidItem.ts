'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

export const voidItem = async (
  orderItemId: string,
  reason?: string,
) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  const user = await getUserByEmail(session.user.email)

  const item = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: { include: { workflow: true } } },
  })

  if (!item) throw new Error("Item not found.")

  const stageVoided = item.order.workflowStatus

  await prisma.$transaction([
    prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        isVoided: true,
        voidedAt: new Date(),
        voidedById: user.id,
        voidReason: reason || null,
        packageId: null,
      },
    }),
    prisma.orderVoid.create({
      data: {
        orderId: item.orderId,
        orderItemId,
        reason: reason || null,
        stageVoided,
      },
    }),
  ])
}
