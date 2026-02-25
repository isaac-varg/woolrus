'use server'

import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { WorkflowStatus } from "@/prisma/generated/enums"
import { getOrder } from "./getOrder"
import { getUserByEmail } from "@/actions/user/getUserByEmail"
import { purchaseLabelsForOrder } from "@/actions/shipping/purchaseLabels"

export const completeQA = async (orderId: string) => {
  const session = await auth()
  const email = session?.user?.email

  const qaById = email ? (await getUserByEmail(email)).id : null

  // Purchase labels MUST succeed before completing QA
  await purchaseLabelsForOrder(orderId)

  await prisma.orderWorkflow.upsert({
    where: { orderId },
    create: {
      orderId,
      status: WorkflowStatus.COMPLETED,
      qaById,
      qaCompletedAt: new Date(),
      completedAt: new Date(),
    },
    update: {
      status: WorkflowStatus.COMPLETED,
      qaById,
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
