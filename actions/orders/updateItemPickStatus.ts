'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { PickStatus } from "@/prisma/generated/enums"

export const updateItemPickStatus = async (itemId: string, status: PickStatus) => {
  const session = await auth()
  const email = session?.user?.email

  const pickedById = email
    ? (await prisma.user.findUnique({ where: { email }, select: { id: true } }))?.id ?? null
    : null

  return await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      pickStatus: status,
      pickedAt: status === PickStatus.PICKED ? new Date() : null,
      pickedById: status === PickStatus.PICKED ? pickedById : null,
    },
  })
}
