'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { PickStatus } from "@/prisma/generated/enums"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

export const updateItemPickStatus = async (itemId: string, status: PickStatus) => {
  const session = await auth()
  const email = session?.user?.email

  const pickedById = email ? (await getUserByEmail(email)).id : null

  return await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      pickStatus: status,
      pickedAt: status === PickStatus.PICKED ? new Date() : null,
      pickedById: status === PickStatus.PICKED ? pickedById : null,
    },
  })
}
