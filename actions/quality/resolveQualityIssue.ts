'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

export const resolveQualityIssue = async (
  id: string,
  resolutionNotes?: string,
) => {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Not authenticated.")
  }

  const user = await getUserByEmail(session.user.email)

  const issue = await prisma.qualityIssue.update({
    where: { id },
    data: {
      resolvedAt: new Date(),
      resolvedById: user.id,
      resolutionNotes,
    },
    include: {
      reportedBy: { select: { id: true, name: true, image: true } },
      responsible: { select: { id: true, name: true, image: true } },
      resolvedBy: { select: { id: true, name: true, image: true } },
      orderItem: true,
      package: true,
      notes: {
        include: {
          author: { select: { id: true, name: true, image: true } },
          attachments: true,
        },
        orderBy: { createdAt: 'desc' as const },
      },
    },
  })

  return issue
}
