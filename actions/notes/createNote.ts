'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

export const createNote = async ({
  orderId,
  orderItemId,
  packageId,
  qualityIssueId,
  content,
}: {
  orderId?: string
  orderItemId?: string
  packageId?: string
  qualityIssueId?: string
  content?: string
}) => {
  if (!orderId && !orderItemId && !packageId && !qualityIssueId) {
    throw new Error("At least one of orderId, orderItemId, packageId, or qualityIssueId must be provided.")
  }

  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  const user = await getUserByEmail(session.user.email)

  const note = await prisma.note.create({
    data: {
      orderId,
      orderItemId,
      packageId,
      qualityIssueId,
      authorId: user.id,
      content,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  return note
}

export type CreatedNote = Awaited<ReturnType<typeof createNote>>
