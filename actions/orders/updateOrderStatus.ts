'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"
import { getUserByEmail } from "@/actions/user/getUserByEmail"

const stageStampsFor = (status: WorkflowStatus, now: Date, userId: string | null) => {
  switch (status) {
    case WorkflowStatus.PICKING:
      return { pickStartedAt: now, assignedToId: userId }
    case WorkflowStatus.PACKING:
      return { pickCompletedAt: now, packStartedAt: now }
    default:
      return {}
  }
}

export const updateOrderStatus = async (orderId: string, status: WorkflowStatus) => {
  const session = await auth()
  const email = session?.user?.email
  const userId = email ? (await getUserByEmail(email)).id : null

  const now = new Date()
  const stamps = stageStampsFor(status, now, userId)

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { workflowStatus: status },
    }),
    prisma.orderWorkflow.upsert({
      where: { orderId },
      create: { orderId, status, ...stamps },
      update: { status, ...stamps },
    }),
  ])

  return await getOrder(orderId)
}
