'use server'

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"

export const completeQA = async (orderId: string) => {
  await prisma.orderWorkflow.upsert({
    where: { orderId },
    create: {
      orderId,
      status: WorkflowStatus.COMPLETED,
      qaCompletedAt: new Date(),
      completedAt: new Date(),
    },
    update: {
      status: WorkflowStatus.COMPLETED,
      qaCompletedAt: new Date(),
      completedAt: new Date(),
    },
  })

  await prisma.order.update({
    where: { id: orderId },
    data: { workflowStatus: WorkflowStatus.COMPLETED },
  })

  return getOrder(orderId)
}
