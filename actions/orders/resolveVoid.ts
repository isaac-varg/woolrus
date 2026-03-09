'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

export const resolveVoid = async (
  id: string,
  resolutionNotes?: string,
) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  const user = await getUserByEmail(session.user.email)

  const orderVoid = await prisma.orderVoid.update({
    where: { id },
    data: {
      isResolved: true,
      resolvedAt: new Date(),
      resolvedById: user.id,
      resolutionNotes,
    },
    include: {
      orderItem: true,
      resolvedBy: { select: { id: true, name: true, image: true } },
    },
  })

  return orderVoid
}
